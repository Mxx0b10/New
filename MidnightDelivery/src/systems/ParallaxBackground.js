// ParallaxBackground
// Owns the layered tile sprites for sky, mid storefronts, near vending
// machines + utility poles, and the road. Speed is driven by the GameScene's
// world scroll speed; each layer scrolls at a fraction of that to fake depth.

import { GAME_WIDTH, GAME_HEIGHT } from '../main.js';

export class ParallaxBackground {
  constructor(scene) {
    this.scene = scene;

    // Far skyline + sky gradient.
    this.far = scene.add.tileSprite(0, 0, GAME_WIDTH, 140, 'bg_far')
      .setOrigin(0, 0).setDepth(0);

    // Mid storefronts.
    this.mid = scene.add.tileSprite(0, 110, GAME_WIDTH, 110, 'bg_mid')
      .setOrigin(0, 0).setDepth(1);

    // Near props (vending machines, poles).
    this.near = scene.add.tileSprite(0, GAME_HEIGHT - 110, GAME_WIDTH, 80, 'bg_near')
      .setOrigin(0, 0).setDepth(2);

    // Road occupies the bottom 60 px.
    this.road = scene.add.tileSprite(0, GAME_HEIGHT - 60, GAME_WIDTH, 60, 'road_tile')
      .setOrigin(0, 0).setDepth(3);

    // Lane separator dashes - drawn as two repeating dashed lines.
    // We use tile sprites so they scroll with the road.
    this.laneA = scene.add.tileSprite(0, GAME_HEIGHT - 42, GAME_WIDTH, 2, 'lane_dash')
      .setOrigin(0, 0).setDepth(4).setAlpha(0.85);
    this.laneB = scene.add.tileSprite(0, GAME_HEIGHT - 22, GAME_WIDTH, 2, 'lane_dash')
      .setOrigin(0, 0).setDepth(4).setAlpha(0.85);

    // Wet sheen line near the top of the road for "rain reflection" feel.
    this.sheen = scene.add.tileSprite(0, GAME_HEIGHT - 60, GAME_WIDTH, 2, 'sheen')
      .setOrigin(0, 0).setDepth(5)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setAlpha(0.7);
  }

  // worldSpeed in pixels/second - the speed at which the road scrolls.
  update(deltaMs, worldSpeed) {
    const dt = deltaMs / 1000;
    this.far.tilePositionX  += worldSpeed * 0.08 * dt;
    this.mid.tilePositionX  += worldSpeed * 0.25 * dt;
    this.near.tilePositionX += worldSpeed * 0.55 * dt;
    this.road.tilePositionX += worldSpeed * 1.0  * dt;
    this.laneA.tilePositionX += worldSpeed * 1.0 * dt;
    this.laneB.tilePositionX += worldSpeed * 1.0 * dt;
    this.sheen.tilePositionX += worldSpeed * 0.9 * dt;
  }
}
