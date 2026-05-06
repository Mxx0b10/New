// StartScene
// Title screen: pixel-art logo, animated background, neon-bordered start button.
// Pressing START / SPACE / ENTER unlocks audio (browsers require a gesture)
// and transitions to GameScene.

import { GAME_WIDTH, GAME_HEIGHT } from '../main.js';
import { PALETTE } from '../utils/AssetGenerator.js';
import { Audio } from '../utils/AudioGenerator.js';

export class StartScene extends Phaser.Scene {
  constructor() { super('Start'); }

  create() {
    // Animated parallax background, slowly drifting for ambience.
    this.far  = this.add.tileSprite(0, 0,                 GAME_WIDTH, 140, 'bg_far').setOrigin(0, 0);
    this.mid  = this.add.tileSprite(0, GAME_HEIGHT - 110 - 30, GAME_WIDTH, 110, 'bg_mid').setOrigin(0, 0);
    this.near = this.add.tileSprite(0, GAME_HEIGHT - 80,   GAME_WIDTH, 80,  'bg_near').setOrigin(0, 0);

    // Subtle road strip at the bottom for context.
    this.road = this.add.tileSprite(0, GAME_HEIGHT - 30, GAME_WIDTH, 30, 'road_tile').setOrigin(0, 0);

    // Rain particles over the whole screen.
    this.rain = this.add.particles(0, -10, 'rain', {
      x: { min: 0, max: GAME_WIDTH },
      y: 0,
      lifespan: 1200,
      speedY: { min: 280, max: 360 },
      speedX: { min: -40, max: -30 },
      alpha: { start: 0.7, end: 0.0 },
      quantity: 2,
      frequency: 30,
      blendMode: 'ADD',
    });

    // Logo with gentle bobbing tween.
    const logo = this.add.image(GAME_WIDTH / 2, 70, 'logo');
    this.tweens.add({
      targets: logo,
      y: 74,
      duration: 1400,
      ease: 'Sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    // Decorative scooter parked under the logo.
    const scooter = this.add.image(GAME_WIDTH / 2, 140, 'scooter_idle').setScale(2);
    this.tweens.add({ targets: scooter, y: 142, duration: 700, ease: 'Sine.inOut', yoyo: true, repeat: -1 });

    // Glow under scooter.
    const glow = this.add.image(GAME_WIDTH / 2, 158, 'glow').setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.6);
    this.tweens.add({ targets: glow, alpha: 0.9, duration: 900, yoyo: true, repeat: -1 });

    // START button.
    const btn = this.add.image(GAME_WIDTH / 2, 195, 'btn_start').setInteractive({ useHandCursor: true });
    const btnLabel = this.add.image(GAME_WIDTH / 2, 195, 'lbl_start');
    this.tweens.add({ targets: [btn, btnLabel], scaleX: 1.04, scaleY: 1.04, duration: 700, yoyo: true, repeat: -1 });

    // Hint line.
    this.add.image(GAME_WIDTH / 2, 230, 'lbl_hint').setAlpha(0.7);

    // "PRESS START" blink near the bottom.
    const press = this.add.image(GAME_WIDTH / 2, 248, 'lbl_press_start').setAlpha(0.9);
    this.tweens.add({ targets: press, alpha: 0.2, duration: 600, yoyo: true, repeat: -1 });

    // Input handlers.
    const start = () => {
      Audio.init();
      Audio.uiClick();
      this.scene.start('Game');
    };
    btn.on('pointerdown', start);
    this.input.keyboard.once('keydown-SPACE', start);
    this.input.keyboard.once('keydown-ENTER', start);

    // Slow drift to give the screen life.
    this.bgScroll = 0;
  }

  update(_time, delta) {
    const t = delta / 1000;
    this.far.tilePositionX  += 4  * t;
    this.mid.tilePositionX  += 12 * t;
    this.near.tilePositionX += 24 * t;
    this.road.tilePositionX += 60 * t;
  }
}
