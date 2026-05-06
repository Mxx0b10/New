// Midnight Delivery - entry point.
// Sets up Phaser with a fixed pixel-art resolution that scales to fit the window,
// then registers all scenes. Keep config minimal here; per-scene logic lives in /scenes.

import { BootScene }     from './scenes/BootScene.js';
import { StartScene }    from './scenes/StartScene.js';
import { GameScene }     from './scenes/GameScene.js';
import { UIScene }       from './scenes/UIScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';

// Internal pixel resolution. The canvas is upscaled with FIT so pixels stay crisp.
export const GAME_WIDTH  = 480;
export const GAME_HEIGHT = 270;

const config = {
  type: Phaser.WEBGL,
  parent: 'game',
  backgroundColor: '#0a0612',
  pixelArt: true,
  roundPixels: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  },
  fps: { target: 60, forceSetTimeOut: false },
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: false },
  },
  scene: [BootScene, StartScene, GameScene, UIScene, GameOverScene],
};

// eslint-disable-next-line no-new
new Phaser.Game(config);
