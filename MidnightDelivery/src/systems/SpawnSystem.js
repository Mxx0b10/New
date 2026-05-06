// SpawnSystem
// Decides what to spawn ahead of the player and when. Difficulty scales over
// time by shortening the spawn interval and biasing the type roll toward
// nastier obstacles.
//
// Coins are also spawned here so we can place them on lanes that are NOT
// occupied by a freshly-spawned obstacle in the same wave.

import { Obstacle, OBSTACLE_TYPES } from '../entities/Obstacle.js';

export class SpawnSystem {
  constructor(scene, lanes, spawnX) {
    this.scene = scene;
    this.lanes = lanes;
    this.spawnX = spawnX;
    this.timeUntilNext = 1.2;
    this.elapsed = 0;
    this.obstacles = [];
    this.coins = [];
  }

  update(deltaMs) {
    const dt = deltaMs / 1000;
    this.elapsed += dt;
    this.timeUntilNext -= dt;
    if (this.timeUntilNext <= 0) {
      this._spawnWave();
      // Spawn cadence shrinks with elapsed time (clamped).
      const base = Phaser.Math.Linear(1.2, 0.5, Math.min(1, this.elapsed / 90));
      this.timeUntilNext = base + Math.random() * 0.4;
    }

    // Tick all obstacles for any per-entity behaviour (e.g. cats).
    for (const o of this.obstacles) o.update();
  }

  _spawnWave() {
    // Difficulty curve: at start, 1 obstacle/wave, max 2 after a while.
    const ramp = Math.min(1, this.elapsed / 60);
    const obstacleCount = Math.random() < 0.3 + ramp * 0.4 ? 2 : 1;

    const usedLanes = new Set();
    for (let i = 0; i < obstacleCount; i++) {
      let lane;
      do { lane = this.lanes.randomLane(); }
      while (usedLanes.has(lane) && usedLanes.size < this.lanes.count - 1);
      // Ensure at least one lane is free for the player to thread through.
      if (usedLanes.size >= this.lanes.count - 1) break;
      usedLanes.add(lane);

      const type = this._pickObstacleType(ramp);
      const o = new Obstacle(this.scene, type, this.spawnX, this.lanes.yFor(lane));
      this.obstacles.push(o);
    }

    // Coin lane - pick any free lane, sometimes spawn a row of 3 coins.
    const freeLanes = [];
    for (let i = 0; i < this.lanes.count; i++) {
      if (!usedLanes.has(i)) freeLanes.push(i);
    }
    if (freeLanes.length && Math.random() < 0.65) {
      const coinLane = freeLanes[Math.floor(Math.random() * freeLanes.length)];
      const coinY = this.lanes.yFor(coinLane);
      const coinCount = Math.random() < 0.4 ? 3 : 1;
      for (let i = 0; i < coinCount; i++) {
        const c = this.scene.physics.add.image(this.spawnX + i * 14, coinY, 'coin');
        c.body.setSize(6, 6);
        c.setDepth(45);
        // Bobbing tween for visual life.
        this.scene.tweens.add({ targets: c, y: coinY - 2, duration: 350, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
        this.coins.push(c);
      }
    }
  }

  // As difficulty ramps up, less common types (barriers, bikes) become more likely.
  _pickObstacleType(ramp) {
    // Weight table evolves with ramp [0..1].
    const weights = {
      cone:    8 - ramp * 2,
      bike:    2 + ramp * 3,
      ped:     3 + ramp * 1.5,
      puddle:  3 + ramp * 1,
      barrier: 1 + ramp * 3,
      cat:     2 + ramp * 1.5,
    };
    let total = 0;
    for (const k of OBSTACLE_TYPES) total += weights[k];
    let r = Math.random() * total;
    for (const k of OBSTACLE_TYPES) {
      r -= weights[k];
      if (r <= 0) return k;
    }
    return 'cone';
  }

  // Cull anything that has scrolled off the left edge.
  cullOffscreen(leftEdgeX) {
    this.obstacles = this.obstacles.filter(o => {
      if (!o.sprite || !o.sprite.active) return false;
      if (o.sprite.x < leftEdgeX) { o.destroy(); return false; }
      return true;
    });
    this.coins = this.coins.filter(c => {
      if (!c.active) return false;
      if (c.x < leftEdgeX) { c.destroy(); return false; }
      return true;
    });
  }

  reset() {
    for (const o of this.obstacles) o.destroy();
    for (const c of this.coins) c.destroy();
    this.obstacles.length = 0;
    this.coins.length = 0;
    this.elapsed = 0;
    this.timeUntilNext = 1.2;
  }
}
