// StabilitySystem
// Tracks the ramen "stability" value in [0..100]. Drains slowly while the
// player is wobbling, drops sharply on collisions, and recovers very slowly
// while the scooter rides smoothly.
//
// When stability hits zero, onDepleted() fires (set by GameScene).

export class StabilitySystem {
  constructor(initial = 100) {
    this.value = initial;
    this.max   = 100;
    this.onDepleted = null;
    this._depleted = false;
  }

  // Per-frame update. instability is the player's current wobble normalised [0..1].
  update(deltaMs, instability) {
    if (this._depleted) return;
    const dt = deltaMs / 1000;

    // Continuous drain proportional to wobble amplitude.
    this.value -= instability * 18 * dt;

    // Slow passive recovery when very stable.
    if (instability < 0.05) {
      this.value += 1.2 * dt;
    }

    this.value = Phaser.Math.Clamp(this.value, 0, this.max);
    if (this.value <= 0) {
      this._depleted = true;
      if (this.onDepleted) this.onDepleted();
    }
  }

  // Big discrete hit, used by collision callbacks.
  damage(amount) {
    if (this._depleted) return;
    this.value = Phaser.Math.Clamp(this.value - amount, 0, this.max);
    if (this.value <= 0) {
      this._depleted = true;
      if (this.onDepleted) this.onDepleted();
    }
  }

  fraction() { return this.value / this.max; }
}
