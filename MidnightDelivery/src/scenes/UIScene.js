// UIScene
// HUD overlay rendered above GameScene. Shows:
//   - score (top-left)
//   - coins counter w/ icon
//   - ramen stability bar w/ icon (color shifts as it drains)
//   - pause button (top-right)
//   - PAUSED label (when paused)
//
// Score/coins are re-rendered by baking small text textures on the fly.
// We update them only when their values change to avoid texture churn.

import { GAME_WIDTH } from '../main.js';
import { drawPixelTextToTexture, PALETTE } from '../utils/AssetGenerator.js';
import { Audio } from '../utils/AudioGenerator.js';

const SCORE_KEY = '__score_dyn';
const COINS_KEY = '__coins_dyn';

export class UIScene extends Phaser.Scene {
  constructor() { super('UI'); }

  init(data) { this.game_ = data.game; }

  create() {
    this._lastScore = -1;
    this._lastCoins = -1;

    // Bake initial textures BEFORE creating their images so Phaser has
    // something to render on frame 1.
    this._bakeText(SCORE_KEY, 'SCORE  000000', PALETTE.white);
    this._bakeText(COINS_KEY, 'x 000',          PALETTE.neonYellow);

    // Score (top-left).
    this.scoreImg = this.add.image(8, 8, SCORE_KEY).setOrigin(0, 0).setDepth(60);

    // Coins (just below score).
    this.coinIcon = this.add.image(8, 22, 'coin').setOrigin(0, 0).setDepth(60);
    this.coinsImg = this.add.image(20, 22, COINS_KEY).setOrigin(0, 0).setDepth(60);

    // Stability bar (centred top).
    this.add.image(GAME_WIDTH / 2 - 60, 10, 'ramen_icon').setOrigin(0, 0).setDepth(60);
    this.barBg = this.add.rectangle(GAME_WIDTH / 2 - 40, 12, 100, 8, 0x1a1226).setOrigin(0, 0).setDepth(60);
    this.barFill = this.add.rectangle(GAME_WIDTH / 2 - 40, 12, 100, 8, PALETTE.neonYellow).setOrigin(0, 0).setDepth(61);
    this.barBorder = this.add.rectangle(GAME_WIDTH / 2 - 40, 12, 100, 8).setOrigin(0, 0)
      .setStrokeStyle(1, 0x44324e).setDepth(62);

    // Pause button (top-right).
    this.pauseBtn = this.add.rectangle(GAME_WIDTH - 22, 12, 16, 14, 0x1f1430)
      .setOrigin(0, 0).setStrokeStyle(1, PALETTE.neonBlue)
      .setInteractive({ useHandCursor: true })
      .setDepth(60);
    this.add.rectangle(GAME_WIDTH - 19, 15, 2, 8, PALETTE.neonBlue).setOrigin(0, 0).setDepth(61);
    this.add.rectangle(GAME_WIDTH - 13, 15, 2, 8, PALETTE.neonBlue).setOrigin(0, 0).setDepth(61);
    this.pauseBtn.on('pointerdown', () => {
      Audio.uiClick();
      this.game_._togglePause();
    });

    // PAUSED overlay - hidden by default.
    this.pausedDim = this.add.rectangle(0, 0, GAME_WIDTH, 270, 0x000000, 0.45)
      .setOrigin(0, 0).setVisible(false).setDepth(70);
    this.pausedLabel = this.add.image(GAME_WIDTH / 2, 130, 'lbl_paused').setVisible(false).setDepth(71);
  }

  update() {
    const g = this.game_;
    if (!g) return;
    const s = Math.floor(g.score);
    if (s !== this._lastScore) this._updateScore(s);
    if (g.coins !== this._lastCoins) this._updateCoins(g.coins);

    const f = g.stability.fraction();
    this.barFill.width = Math.max(0, Math.round(100 * f));
    if      (f > 0.6) this.barFill.fillColor = PALETTE.neonYellow;
    else if (f > 0.3) this.barFill.fillColor = PALETTE.warmLight;
    else              this.barFill.fillColor = PALETTE.neonRed;
  }

  setPaused(v) {
    this.pausedDim.setVisible(v);
    this.pausedLabel.setVisible(v);
  }

  _bakeText(key, text, color) {
    if (this.textures.exists(key)) this.textures.remove(key);
    drawPixelTextToTexture(this, key, text, color, 1);
  }

  _updateScore(s) {
    this._lastScore = s;
    this._bakeText(SCORE_KEY, `SCORE  ${s.toString().padStart(6, '0')}`, PALETTE.white);
    this.scoreImg.setTexture(SCORE_KEY);
  }

  _updateCoins(c) {
    this._lastCoins = c;
    this._bakeText(COINS_KEY, `x ${c.toString().padStart(3, '0')}`, PALETTE.neonYellow);
    this.coinsImg.setTexture(COINS_KEY);
  }
}
