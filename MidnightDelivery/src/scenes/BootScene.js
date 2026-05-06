// BootScene
// Generates every texture procedurally and a few preset text textures,
// then hands off to the StartScene. Runs once at startup.

import { generateAllAssets, drawPixelTextToTexture, PALETTE } from '../utils/AssetGenerator.js';

export class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  create() {
    generateAllAssets(this);

    // Bake some commonly-used text labels as textures (sharper than runtime web fonts).
    drawPixelTextToTexture(this, 'lbl_press_start', 'PRESS START',  PALETTE.white,    1);
    drawPixelTextToTexture(this, 'lbl_start',       'START',        PALETTE.white,    2);
    drawPixelTextToTexture(this, 'lbl_restart',     'RESTART',      PALETTE.white,    2);
    drawPixelTextToTexture(this, 'lbl_paused',      'PAUSED',       PALETTE.neonYellow, 3);
    drawPixelTextToTexture(this, 'lbl_gameover',    'GAME OVER',    PALETTE.neonPink, 3);
    drawPixelTextToTexture(this, 'lbl_hint',        'ARROWS MOVE  SHIFT BOOST  DOWN BRAKE  P PAUSE', PALETTE.white, 1);

    this.scene.start('Start');
  }
}
