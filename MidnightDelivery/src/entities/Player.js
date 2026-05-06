// Player - the scooter rider.
// Encapsulates lane position, lean animation, ramen wobble, and brake/boost state.
// Visuals are made of two sprites stacked: the scooter+rider, plus a tiny
// ramen bowl strapped to the rear rack that wobbles independently for feedback.

export class Player {
  constructor(scene, lanes, startLane = 1) {
    this.scene = scene;
    this.lanes = lanes;            // LaneSystem instance
    this.laneIndex = startLane;    // 0,1,2

    // Movement state
    this.x = 90;                   // fixed-ish horizontal anchor on screen
    this.y = lanes.yFor(startLane);
    this.targetY = this.y;
    this.leanFrames = 0;           // how long to keep lean sprite

    // Speed multipliers (driven by GameScene scrolling system, but used here for engine SFX)
    this.boost = false;
    this.brake = false;

    // Ramen wobble - small offset added to the bowl sprite each frame
    this.wobble = 0;               // current wobble amplitude in pixels
    this.wobbleVel = 0;

    // Sprite
    this.sprite = scene.physics.add.sprite(this.x, this.y, 'scooter_idle');
    this.sprite.setSize(22, 14).setOffset(5, 8);
    this.sprite.setDepth(50);

    // Headlight glow
    this.glow = scene.add.image(this.x + 18, this.y + 2, 'glow')
      .setBlendMode(Phaser.BlendModes.ADD)
      .setAlpha(0.55)
      .setDepth(49)
      .setScale(1.1);

    // Ramen bowl, stacked on the rear of the scooter
    this.bowl = scene.add.image(this.x - 8, this.y - 6, 'ramen_icon')
      .setDepth(51);
  }

  // --- Movement helpers, called by GameScene in response to input ---
  moveLeft() {
    if (this.laneIndex > 0) {
      this.laneIndex--;
      this._snapToLane(-1);
    }
  }
  moveRight() {
    if (this.laneIndex < this.lanes.count - 1) {
      this.laneIndex++;
      this._snapToLane(1);
    }
  }

  _snapToLane(dir) {
    this.targetY = this.lanes.yFor(this.laneIndex);
    this.leanFrames = 12;
    this.sprite.setTexture(dir < 0 ? 'scooter_left' : 'scooter_right');
    // Lane changes punch the ramen
    this.applyJolt(2.4);
  }

  setBoost(v) { this.boost = v; }
  setBrake(v) { this.brake = v; }

  // Apply a wobble jolt - lane changes use small values, collisions use big ones.
  applyJolt(power) {
    this.wobbleVel += (Math.random() < 0.5 ? -1 : 1) * power;
  }

  update(_time, deltaMs) {
    const dt = deltaMs / 1000;

    // Smoothly approach target lane Y
    const toY = this.targetY - this.y;
    this.y += toY * Math.min(1, dt * 12);
    this.sprite.y = Math.round(this.y);

    // Drop lean back to idle after a few frames
    if (this.leanFrames > 0) {
      this.leanFrames--;
      if (this.leanFrames === 0) this.sprite.setTexture('scooter_idle');
    }

    // Spring-damper for ramen wobble: Hooke's law toward 0 with damping.
    const k = 18;       // stiffness
    const d = 4.5;      // damping
    const accel = -k * this.wobble - d * this.wobbleVel;
    this.wobbleVel += accel * dt;
    this.wobble    += this.wobbleVel * dt;

    // Bowl follows scooter with wobble offset, rotates slightly with velocity.
    this.bowl.x = Math.round(this.sprite.x - 8 + this.wobble * 0.6);
    this.bowl.y = Math.round(this.sprite.y - 6 - Math.abs(this.wobble) * 0.2);
    this.bowl.rotation = Phaser.Math.Clamp(this.wobbleVel * 0.04, -0.35, 0.35);

    // Headlight follows + flickers gently
    this.glow.x = this.sprite.x + 18;
    this.glow.y = this.sprite.y + 2;
    this.glow.alpha = 0.5 + Math.sin(this.scene.time.now * 0.02) * 0.05 + Math.random() * 0.04;
  }

  destroy() {
    this.sprite.destroy();
    this.glow.destroy();
    this.bowl.destroy();
  }

  // Reports an instability score in [0..1] for the stability system to drain.
  getInstability() {
    return Math.min(1, Math.abs(this.wobble) / 8);
  }
}
