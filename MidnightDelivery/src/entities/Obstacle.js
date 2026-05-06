// Obstacle - thin wrapper around an Arcade physics sprite.
// Each obstacle has a "type" that drives its art, hitbox, and how it
// punishes the player on collision.
//
// Types:
//   cone      - small, high spill on hit
//   bike      - wide, very high spill
//   ped       - medium, hard hit
//   puddle    - wide, low damage but BIG wobble (slippery)
//   barrier   - wide, instant near-fail
//   cat       - small, animated dart across lanes
//
// Puddles are non-fatal-by-themselves; they're "soft" hazards that drain
// stability, encouraging the player to weave around them.

const TYPE_DEFS = {
  cone:     { tex: 'obs_cone',    hitW: 8,  hitH: 6,  damage: 18, wobble: 2.8, soft: false },
  bike:     { tex: 'obs_bike',    hitW: 22, hitH: 8,  damage: 32, wobble: 4.5, soft: false },
  ped:      { tex: 'obs_ped',     hitW: 10, hitH: 10, damage: 28, wobble: 4.0, soft: false },
  puddle:   { tex: 'obs_puddle',  hitW: 26, hitH: 5,  damage: 8,  wobble: 5.0, soft: true  },
  barrier:  { tex: 'obs_barrier', hitW: 22, hitH: 8,  damage: 55, wobble: 6.0, soft: false },
  cat:      { tex: 'obs_cat',     hitW: 12, hitH: 5,  damage: 22, wobble: 3.6, soft: false },
};

export const OBSTACLE_TYPES = Object.keys(TYPE_DEFS);

export class Obstacle {
  constructor(scene, type, x, y) {
    const def = TYPE_DEFS[type];
    this.scene = scene;
    this.type = type;
    this.def = def;
    this.consumed = false;        // marked true after collision so we only hit once

    this.sprite = scene.physics.add.sprite(x, y, def.tex);
    this.sprite.body.setSize(def.hitW, def.hitH);
    this.sprite.setDepth(40);
    this.sprite.setData('owner', this);

    // Cats wobble across two lanes for a bit of extra threat.
    if (type === 'cat') {
      this.sprite.setVelocityY((Math.random() < 0.5 ? -1 : 1) * 24);
    }
  }

  update() {
    // Cats reverse Y when reaching road edges - bounded by lane positions.
    if (this.type === 'cat') {
      if (this.sprite.y < 165) this.sprite.setVelocityY(24);
      if (this.sprite.y > 230) this.sprite.setVelocityY(-24);
    }
  }

  destroy() {
    if (this.sprite) this.sprite.destroy();
  }
}
