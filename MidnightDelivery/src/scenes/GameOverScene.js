// GameOverScene
// Shows final score + coins, plus a restart button. Spawned as an overlay
// on top of a paused GameScene so the streetscape stays visible behind it.

import { GAME_WIDTH, GAME_HEIGHT } from '../main.js';
import { drawPixelTextToTexture, PALETTE } from '../utils/AssetGenerator.js';
import { Audio } from '../utils/AudioGenerator.js';

export class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOver'); }

  init(data) {
    this.finalScore = data.score | 0;
    this.finalCoins = data.coins | 0;
  }

  create() {
    // Dim the world behind us.
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.55).setOrigin(0, 0);

    // GAME OVER title.
    this.add.image(GAME_WIDTH / 2, 70, 'lbl_gameover');

    // Score / coins lines, generated on the fly so values update each run.
    drawPixelTextToTexture(this, 'lbl_final_score', `SCORE  ${this.finalScore}`, PALETTE.white, 2);
    drawPixelTextToTexture(this, 'lbl_final_coins', `COINS  ${this.finalCoins}`, PALETTE.neonYellow, 2);
    this.add.image(GAME_WIDTH / 2, 115, 'lbl_final_score');
    this.add.image(GAME_WIDTH / 2, 140, 'lbl_final_coins');

    // Restart button.
    const btn = this.add.image(GAME_WIDTH / 2, 190, 'btn_restart').setInteractive({ useHandCursor: true });
    this.add.image(GAME_WIDTH / 2, 190, 'lbl_restart');

    const restart = () => {
      Audio.uiClick();
      this.scene.stop('UI');
      this.scene.stop('Game');
      this.scene.start('Game');
    };
    btn.on('pointerdown', restart);
    this.input.keyboard.once('keydown-SPACE', restart);
    this.input.keyboard.once('keydown-ENTER', restart);
  }
}
