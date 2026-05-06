// GameScene
// Owns the main gameplay loop:
//   - parallax background scrolling at "world speed"
//   - the player (lane changes, brake, boost)
//   - obstacle + coin spawning, scrolling, culling
//   - collision -> stability damage -> game over
//
// World motion is faked by scrolling the *background* and *obstacles* leftward
// while the player stays at a fixed X. World speed is the only number the
// rest of the game cares about; everything else derives from it.

import { GAME_WIDTH, GAME_HEIGHT } from '../main.js';
import { Player } from '../entities/Player.js';
import { LaneSystem } from '../systems/LaneSystem.js';
import { StabilitySystem } from '../systems/StabilitySystem.js';
import { SpawnSystem } from '../systems/SpawnSystem.js';
import { ParallaxBackground } from '../systems/ParallaxBackground.js';
import { Audio } from '../utils/AudioGenerator.js';

const BASE_SPEED = 140;     // px/sec at start
const MAX_SPEED  = 280;     // px/sec cap
const RAMP_SECS  = 90;      // time to reach max speed
const BOOST_MULT = 1.55;
const BRAKE_MULT = 0.55;

export class GameScene extends Phaser.Scene {
  constructor() { super('Game'); }

  create() {
    // --- World state ---
    this.elapsed   = 0;
    this.score     = 0;
    this.coins     = 0;
    this.gameOver  = false;
    this.invuln    = 0;        // brief i-frames after a hit

    // --- Lanes occupy bottom slice of the screen ---
    this.lanes = new LaneSystem(GAME_HEIGHT - 50, GAME_HEIGHT - 14, 3);

    // --- Background ---
    this.bg = new ParallaxBackground(this);

    // --- Rain particle system, layered above road but below player ---
    this.rain = this.add.particles(0, -10, 'rain', {
      x: { min: 0, max: GAME_WIDTH },
      y: 0,
      lifespan: 1100,
      speedY: { min: 320, max: 400 },
      speedX: { min: -40, max: -20 },
      alpha: { start: 0.6, end: 0.0 },
      quantity: 2,
      frequency: 26,
      blendMode: 'ADD',
    }).setDepth(20);

    // --- Player ---
    this.player = new Player(this, this.lanes, 1);

    // --- Stability ---
    this.stability = new StabilitySystem(100);
    this.stability.onDepleted = () => this._endGame();

    // --- Spawning ---
    this.spawner = new SpawnSystem(this, this.lanes, GAME_WIDTH + 30);

    // --- Input ---
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyShift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    this.input.keyboard.on('keydown-LEFT',  () => !this.gameOver && this.player.moveLeft());
    this.input.keyboard.on('keydown-RIGHT', () => !this.gameOver && this.player.moveRight());
    this.input.keyboard.on('keydown-A',     () => !this.gameOver && this.player.moveLeft());
    this.input.keyboard.on('keydown-D',     () => !this.gameOver && this.player.moveRight());
    this.input.keyboard.on('keydown-P',     () => this._togglePause());
    this.input.keyboard.on('keydown-ESC',   () => this._togglePause());

    // Also support touch swipes for mobile.
    this._installTouchControls();

    // --- Launch UI overlay (paused if we pause the game) ---
    this.scene.launch('UI', { game: this });

    // --- Start audio ---
    Audio.init();
    Audio.startEngine();
    Audio.startMusic();
  }

  // ---------- Touch controls ----------
  _installTouchControls() {
    let startX = 0, startY = 0, tracking = false;
    this.input.on('pointerdown', (p) => { startX = p.x; startY = p.y; tracking = true; });
    this.input.on('pointerup',   (p) => {
      if (!tracking) return;
      tracking = false;
      const dx = p.x - startX;
      const dy = p.y - startY;
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 24) {
        if (dy < 0) this.player.setBoost(true), this.time.delayedCall(700, () => this.player.setBoost(false));
        else this.player.setBrake(true), this.time.delayedCall(500, () => this.player.setBrake(false));
      } else if (Math.abs(dx) > 18) {
        if (dx < 0) this.player.moveLeft();
        else this.player.moveRight();
      }
    });
  }

  // ---------- Pause toggling ----------
  _togglePause() {
    if (this.gameOver) return;
    if (this.scene.isPaused('Game')) {
      this.scene.resume('Game');
      this.scene.get('UI').setPaused(false);
      Audio.startEngine();
    } else {
      this.scene.pause('Game');
      this.scene.get('UI').setPaused(true);
      Audio.stopEngine();
    }
  }

  // ---------- World speed driven by elapsed time, plus boost/brake ----------
  _currentSpeed() {
    const t = Math.min(1, this.elapsed / RAMP_SECS);
    let s = Phaser.Math.Linear(BASE_SPEED, MAX_SPEED, t);
    if (this.player.boost) s *= BOOST_MULT;
    if (this.player.brake) s *= BRAKE_MULT;
    return s;
  }

  update(_time, deltaMs) {
    if (this.gameOver) return;
    const dt = deltaMs / 1000;
    this.elapsed += dt;
    if (this.invuln > 0) this.invuln -= dt;

    // Read held keys for boost/brake every frame
    this.player.setBoost(this.keyShift.isDown);
    this.player.setBrake(this.cursors.down.isDown);

    const speed = this._currentSpeed();
    const speedNorm = (speed - BASE_SPEED) / (MAX_SPEED * BOOST_MULT - BASE_SPEED);
    Audio.setEngineIntensity(Phaser.Math.Clamp(speedNorm, 0, 1));

    // Background scroll
    this.bg.update(deltaMs, speed);

    // Player update
    this.player.update(_time, deltaMs);

    // Move all obstacles + coins leftward at world speed, with culling
    const dx = -speed * dt;
    for (const o of this.spawner.obstacles) {
      if (o.sprite) o.sprite.x += dx;
    }
    for (const c of this.spawner.coins) {
      c.x += dx;
    }

    // Spawn new content
    this.spawner.update(deltaMs);

    // Cull behind player
    this.spawner.cullOffscreen(-40);

    // Collision checks
    this._handleCollisions();

    // Stability drain from sustained wobble
    this.stability.update(deltaMs, this.player.getInstability());

    // Score: time-based + later coin bonus added in collectCoin
    this.score += dt * 10 * (speed / BASE_SPEED);
  }

  // Shrunk bounds - sprite art has transparent margins, so we inset to make
  // collision feel fair. padX/padY are pixels removed from each side.
  _tightBounds(sprite, padX, padY) {
    const b = sprite.getBounds();
    return new Phaser.Geom.Rectangle(b.x + padX, b.y + padY, b.width - padX * 2, b.height - padY * 2);
  }

  _handleCollisions() {
    // Player hitbox is intentionally smaller than the sprite for forgiveness.
    const playerBox = this._tightBounds(this.player.sprite, 6, 4);

    // Coins - cheap rect overlap, no physics callbacks needed.
    for (const c of this.spawner.coins) {
      if (!c.active) continue;
      if (Phaser.Geom.Intersects.RectangleToRectangle(playerBox, c.getBounds())) {
        c.destroy();
        this.coins += 1;
        this.score += 25;
        Audio.coin();
      }
    }

    if (this.invuln > 0) return;

    for (const o of this.spawner.obstacles) {
      if (!o.sprite || !o.sprite.active || o.consumed) continue;
      // Per-type hitbox padding - puddles cover their full visual area, others shrink a bit.
      const padX = o.def.soft ? 1 : 3;
      const padY = o.def.soft ? 1 : 3;
      const oBox = this._tightBounds(o.sprite, padX, padY);
      if (Phaser.Geom.Intersects.RectangleToRectangle(playerBox, oBox)) {
        this._onHit(o);
        if (this.gameOver) return;
      }
    }
  }

  _onHit(obstacle) {
    obstacle.consumed = true;
    const def = obstacle.def;

    this.stability.damage(def.damage);
    this.player.applyJolt(def.wobble);

    // Camera shake + flash for impact feedback.
    this.cameras.main.shake(def.soft ? 80 : 180, def.soft ? 0.003 : 0.006);
    if (!def.soft) this.cameras.main.flash(120, 80, 20, 60);

    // SFX
    if (def.soft) Audio.spill();
    else          Audio.crash();

    // Soft hazards (puddles) survive contact and don't despawn.
    if (!def.soft) {
      // Briefly hide the obstacle as feedback.
      this.tweens.add({
        targets: obstacle.sprite,
        alpha: 0,
        duration: 200,
        onComplete: () => obstacle.destroy(),
      });
    } else {
      // Quick wobble to suggest splash, then keep moving.
      this.tweens.add({ targets: obstacle.sprite, alpha: 0.5, duration: 120, yoyo: true, repeat: 1 });
    }

    this.invuln = 0.5;
  }

  _endGame() {
    if (this.gameOver) return;
    this.gameOver = true;
    Audio.crash();
    Audio.stopEngine();
    Audio.stopMusic();

    // Slow-mo zoom for emphasis.
    this.cameras.main.zoomTo(1.15, 400, 'Sine.easeOut');
    this.tweens.add({
      targets: this.player.sprite,
      angle: -30,
      x: this.player.sprite.x - 12,
      duration: 500,
      ease: 'Cubic.easeOut',
    });

    this.time.delayedCall(700, () => {
      this.scene.pause('Game');
      this.scene.launch('GameOver', {
        score: Math.floor(this.score),
        coins: this.coins,
      });
    });
  }
}
