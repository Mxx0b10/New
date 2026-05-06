// AssetGenerator
// Generates every sprite in the game procedurally as pixel-art textures
// so the game has zero external asset dependencies. Each generator draws
// into an offscreen Phaser.GameObjects.Graphics, then bakes it to a texture
// via generateTexture() so it can be used by sprites/images downstream.
//
// Palette is intentionally narrow - cozy warm tones + neon blues/pinks.

export const PALETTE = {
  bg0: 0x0a0612,   // deep night sky
  bg1: 0x1b1530,   // distant buildings
  bg2: 0x2a1f44,   // mid buildings
  bg3: 0x3d2c5e,   // near buildings
  road: 0x141018,
  roadWet: 0x1f1a2e,
  laneLine: 0xfff0a8,
  neonPink: 0xff5fa8,
  neonBlue: 0x5fd9ff,
  neonYellow: 0xffe27a,
  neonRed: 0xff6464,
  warmLight: 0xffb070,
  white: 0xf6f0ff,
  shadow: 0x000000,
  scooterRed: 0xd94646,
  scooterDark: 0x6e1f1f,
  riderJacket: 0x2b3a6e,
  riderHelmet: 0xf1e9d2,
  skin: 0xe8b58a,
  ramenBowl: 0xe8e1d0,
  ramenBroth: 0xc97a3a,
  cone: 0xff9a3c,
  coneStripe: 0xfff0d0,
  bike: 0x8aa8ff,
  cat: 0x2a2229,
  catEye: 0xffe27a,
  puddle: 0x405a7a,
  barrier: 0xc94a4a,
  pedestrian: 0x7a8db5,
  coin: 0xffd24a,
  coinShade: 0xb8852a,
};

// Helper - draws a filled pixel rectangle on a Graphics object.
function px(g, x, y, w, h, color, alpha = 1) {
  g.fillStyle(color, alpha);
  g.fillRect(x, y, w, h);
}

// Helper - draws a single pixel.
function p(g, x, y, color, alpha = 1) {
  g.fillStyle(color, alpha);
  g.fillRect(x, y, 1, 1);
}

// Bake the current Graphics state into a texture and clear it for reuse.
function bake(scene, g, key, w, h) {
  g.generateTexture(key, w, h);
  g.clear();
}

export function generateAllAssets(scene) {
  const g = scene.add.graphics({ x: 0, y: 0 });
  g.setVisible(false);

  generateScooterRider(scene, g);
  generateRamenBowl(scene, g);
  generateObstacles(scene, g);
  generateCoin(scene, g);
  generateRoadTile(scene, g);
  generatePuddleSheen(scene, g);
  generateBackgroundLayers(scene, g);
  generateRainParticle(scene, g);
  generateNeonGlow(scene, g);
  generateLogo(scene, g);
  generateButton(scene, g);

  g.destroy();
}

// --- Scooter rider, 3 frames (idle, lean-left, lean-right) ---
// Each frame is 32x24, with the scooter facing right.
function generateScooterRider(scene, g) {
  const W = 32, H = 24;
  const frames = ['scooter_idle', 'scooter_left', 'scooter_right'];

  frames.forEach((key, i) => {
    g.clear();
    const lean = i === 1 ? -1 : i === 2 ? 1 : 0;

    // Shadow
    px(g, 4, H - 2, 24, 2, PALETTE.shadow, 0.45);

    // Wheels
    px(g, 5,  H - 6, 5, 5, PALETTE.shadow);
    px(g, 22, H - 6, 5, 5, PALETTE.shadow);
    p(g, 7,  H - 4, PALETTE.white, 0.7);
    p(g, 24, H - 4, PALETTE.white, 0.7);

    // Scooter body
    px(g, 8, H - 10, 16, 4, PALETTE.scooterRed);
    px(g, 8, H - 10, 16, 1, PALETTE.scooterDark);
    px(g, 22, H - 12, 3, 3, PALETTE.scooterRed); // headlight housing
    p(g, 24, H - 11, PALETTE.neonYellow);         // headlight

    // Front handlebar
    px(g, 23, H - 14, 1, 4, PALETTE.scooterDark);
    px(g, 22, H - 15, 4, 1, PALETTE.scooterDark);

    // Rider body, tilted by lean
    const bx = 12 + lean;
    px(g, bx,     H - 16, 6, 6, PALETTE.riderJacket);     // torso
    px(g, bx + 1, H - 17, 4, 1, PALETTE.riderJacket);
    // Head + helmet
    px(g, bx + 1, H - 21, 4, 4, PALETTE.riderHelmet);
    px(g, bx + 1, H - 21, 4, 1, PALETTE.shadow);          // visor
    p(g, bx + 4, H - 19, PALETTE.neonBlue, 0.9);          // visor glint
    // Arm reaching to handlebar
    px(g, bx + 5, H - 15, 4, 1, PALETTE.riderJacket);
    // Leg
    px(g, bx + 1, H - 11, 2, 2, PALETTE.riderJacket);

    // Delivery box on back rack
    px(g, 6, H - 14, 6, 5, PALETTE.warmLight);
    px(g, 6, H - 14, 6, 1, PALETTE.shadow);
    p(g, 9, H - 12, PALETTE.neonPink);

    bake(scene, g, key, W, H);
  });
}

// --- Ramen bowl, drawn as a HUD widget icon (16x12) ---
function generateRamenBowl(scene, g) {
  g.clear();
  const W = 16, H = 12;
  // bowl
  px(g, 1,  6, 14, 5, PALETTE.ramenBowl);
  px(g, 1,  6, 14, 1, PALETTE.shadow);
  px(g, 0,  7, 1, 3, PALETTE.ramenBowl);
  px(g, 15, 7, 1, 3, PALETTE.ramenBowl);
  // broth
  px(g, 2,  5, 12, 2, PALETTE.ramenBroth);
  // noodles
  p(g, 4, 4, PALETTE.ramenBowl);
  p(g, 7, 4, PALETTE.ramenBowl);
  p(g, 10, 4, PALETTE.ramenBowl);
  // steam
  p(g, 5, 1, PALETTE.white, 0.5);
  p(g, 8, 0, PALETTE.white, 0.5);
  p(g, 11, 1, PALETTE.white, 0.5);
  bake(scene, g, 'ramen_icon', W, H);
}

// --- Obstacles ---
function generateObstacles(scene, g) {
  // Traffic cone, 12x14
  g.clear();
  px(g, 3,  12, 6, 2, PALETTE.shadow);
  px(g, 4,  10, 4, 2, PALETTE.cone);
  px(g, 4,   8, 4, 1, PALETTE.coneStripe);
  px(g, 4,   6, 4, 2, PALETTE.cone);
  px(g, 5,   3, 2, 3, PALETTE.cone);
  bake(scene, g, 'obs_cone', 12, 14);

  // Bicycle, 24x18 (parked across the lane)
  g.clear();
  px(g, 2, 14, 6, 4, PALETTE.shadow);
  px(g, 16, 14, 6, 4, PALETTE.shadow);
  px(g, 4, 12, 16, 1, PALETTE.bike);
  px(g, 12, 6, 1, 8, PALETTE.bike);
  px(g, 8, 8, 6, 1, PALETTE.bike);
  px(g, 7, 5, 4, 2, PALETTE.bike);   // seat
  bake(scene, g, 'obs_bike', 24, 18);

  // Pedestrian, 12x20
  g.clear();
  px(g, 4, 17, 4, 3, PALETTE.shadow);
  px(g, 4, 10, 4, 7, PALETTE.pedestrian);
  px(g, 4, 5, 4, 5, PALETTE.skin);
  px(g, 4, 4, 4, 2, PALETTE.shadow);     // hair
  p(g, 5, 8, PALETTE.shadow);
  p(g, 6, 8, PALETTE.shadow);
  bake(scene, g, 'obs_ped', 12, 20);

  // Puddle, 28x10
  g.clear();
  px(g, 4, 4, 20, 4, PALETTE.puddle);
  px(g, 2, 5, 24, 2, PALETTE.puddle);
  px(g, 6, 3, 16, 1, PALETTE.neonBlue, 0.55);
  px(g, 8, 6, 12, 1, PALETTE.neonPink, 0.45);
  bake(scene, g, 'obs_puddle', 28, 10);

  // Road barrier, 24x14 (red/white striped)
  g.clear();
  px(g, 1, 11, 22, 3, PALETTE.shadow);
  for (let x = 0; x < 24; x += 4) {
    const c = (x / 4) % 2 === 0 ? PALETTE.barrier : PALETTE.white;
    px(g, x, 4, 4, 7, c);
  }
  px(g, 0, 3, 24, 1, PALETTE.shadow);
  bake(scene, g, 'obs_barrier', 24, 14);

  // Cat, 16x10
  g.clear();
  px(g, 4, 8, 8, 2, PALETTE.shadow);
  px(g, 3, 4, 10, 4, PALETTE.cat);
  px(g, 12, 3, 3, 3, PALETTE.cat);     // head
  p(g, 12, 2, PALETTE.cat);             // ear
  p(g, 14, 2, PALETTE.cat);
  p(g, 13, 4, PALETTE.catEye);          // eye
  px(g, 1, 5, 2, 1, PALETTE.cat);       // tail
  bake(scene, g, 'obs_cat', 16, 10);
}

// --- Coin, 8x8, simple glint ---
function generateCoin(scene, g) {
  g.clear();
  px(g, 2, 1, 4, 6, PALETTE.coin);
  px(g, 1, 2, 6, 4, PALETTE.coin);
  px(g, 2, 6, 4, 1, PALETTE.coinShade);
  p(g, 5, 5, PALETTE.coinShade);
  p(g, 2, 2, PALETTE.white);
  bake(scene, g, 'coin', 8, 8);
}

// --- Road tile, 64x32, with lane lines and wet sheen ---
function generateRoadTile(scene, g) {
  g.clear();
  const W = 64, H = 32;
  px(g, 0, 0, W, H, PALETTE.road);
  // wet sheen streaks
  for (let i = 0; i < 6; i++) {
    const y = (i * 5) % H;
    px(g, 0, y, W, 1, PALETTE.roadWet, 0.5);
  }
  // dashed lane lines (game has 3 lanes, so 2 separators)
  // These are drawn at fractional thirds of the screen height in GameScene;
  // here we provide a small reusable dash texture instead.
  bake(scene, g, 'road_tile', W, H);

  // Lane dash, 12x2
  g.clear();
  px(g, 0, 0, 12, 2, PALETTE.laneLine, 0.85);
  bake(scene, g, 'lane_dash', 12, 2);
}

// --- Puddle reflection sheen overlay (decorative, not collidable) ---
function generatePuddleSheen(scene, g) {
  g.clear();
  px(g, 0, 0, 40, 1, PALETTE.neonPink, 0.25);
  px(g, 0, 1, 40, 1, PALETTE.neonBlue, 0.20);
  bake(scene, g, 'sheen', 40, 2);
}

// --- Parallax background layers ---
// Three layers: far skyline, mid storefronts, near vending machines & poles.
function generateBackgroundLayers(scene, g) {
  // Far layer - silhouetted skyline against a gradient sky (480x140)
  g.clear();
  // Sky gradient (manual band approximation)
  const skyBands = [
    { y:0,  h:30, c:PALETTE.bg0 },
    { y:30, h:30, c:0x140e22 },
    { y:60, h:30, c:0x1a1230 },
    { y:90, h:50, c:PALETTE.bg1 },
  ];
  skyBands.forEach(b => px(g, 0, b.y, 480, b.h, b.c));
  // Stars
  for (let i = 0; i < 40; i++) {
    const x = (i * 47) % 480;
    const y = (i * 13) % 70;
    p(g, x, y, PALETTE.white, 0.6);
  }
  // Distant skyline silhouettes
  let x = 0;
  while (x < 480) {
    const w = 12 + ((x * 7) % 18);
    const h = 18 + ((x * 11) % 24);
    px(g, x, 140 - h, w, h, PALETTE.bg1);
    // Random lit windows
    for (let wy = 140 - h + 4; wy < 140 - 4; wy += 4) {
      if (((x + wy) * 13) % 7 < 2) p(g, x + 2 + ((wy * 3) % (w - 4)), wy, PALETTE.warmLight, 0.8);
    }
    x += w + 1;
  }
  bake(scene, g, 'bg_far', 480, 140);

  // Mid layer - Japanese storefronts with neon signs (480x110)
  g.clear();
  px(g, 0, 0, 480, 110, 0x000000, 0); // transparent base
  let sx = 0;
  let storeIdx = 0;
  while (sx < 480) {
    const w = 50 + ((sx * 3) % 30);
    const facadeH = 70;
    const baseY = 110 - facadeH;
    // Building facade
    px(g, sx, baseY, w, facadeH, PALETTE.bg2);
    px(g, sx, baseY, w, 1, PALETTE.bg3);
    // Awning
    const awningC = [PALETTE.neonRed, PALETTE.warmLight, PALETTE.bg3, PALETTE.neonPink][storeIdx % 4];
    px(g, sx + 2, baseY + 22, w - 4, 6, awningC);
    px(g, sx + 2, baseY + 22, w - 4, 1, PALETTE.shadow);
    // Window glow
    px(g, sx + 6, baseY + 30, w - 12, 14, PALETTE.warmLight, 0.55);
    // Door frame
    px(g, sx + (w >> 1) - 4, baseY + 44, 8, 26, 0x1a1226);
    // Lit door slit
    px(g, sx + (w >> 1) - 2, baseY + 48, 4, 18, PALETTE.warmLight, 0.7);
    // Neon sign on top
    const neonC = [PALETTE.neonPink, PALETTE.neonBlue, PALETTE.neonYellow, PALETTE.neonRed][storeIdx % 4];
    px(g, sx + 4, baseY + 4, w - 8, 12, 0x0d0820);
    px(g, sx + 4, baseY + 4, w - 8, 12, neonC, 0.35);
    // "Kanji" pseudo-glyphs (just blocky strokes)
    for (let k = 0; k < 3; k++) {
      const gx = sx + 8 + k * 10;
      const gy = baseY + 7;
      px(g, gx, gy, 6, 1, neonC);
      px(g, gx + 2, gy + 2, 2, 4, neonC);
      px(g, gx, gy + 4, 6, 1, neonC);
    }
    sx += w;
    storeIdx++;
  }
  bake(scene, g, 'bg_mid', 480, 110);

  // Near layer - vending machines, utility poles, wires (480x80)
  g.clear();
  px(g, 0, 0, 480, 80, 0x000000, 0);
  // Wires across the top
  px(g, 0, 6, 480, 1, PALETTE.shadow, 0.7);
  px(g, 0, 10, 480, 1, PALETTE.shadow, 0.5);
  // Utility poles
  for (let pxn = 30; pxn < 480; pxn += 130) {
    px(g, pxn, 0, 2, 80, 0x161220);
    px(g, pxn - 6, 8, 14, 1, 0x161220);
  }
  // Vending machines, scattered
  const vendingPositions = [70, 200, 330, 430];
  vendingPositions.forEach((vx, i) => {
    const c = i % 2 === 0 ? PALETTE.neonRed : PALETTE.neonBlue;
    px(g, vx, 50, 18, 30, 0x10131a);
    px(g, vx + 1, 51, 16, 10, c);
    px(g, vx + 2, 52, 14, 8, PALETTE.white, 0.25);
    px(g, vx + 1, 62, 16, 16, 0x1d1a26);
    // bottle silhouettes
    for (let b = 0; b < 3; b++) {
      px(g, vx + 3 + b * 5, 64, 3, 8, PALETTE.warmLight, 0.7);
    }
    // glow under
    px(g, vx - 4, 80 - 1, 26, 1, c, 0.4);
  });
  bake(scene, g, 'bg_near', 480, 80);
}

// --- Rain particle, 1x4 streak ---
function generateRainParticle(scene, g) {
  g.clear();
  px(g, 0, 0, 1, 4, PALETTE.neonBlue, 0.55);
  bake(scene, g, 'rain', 1, 4);
}

// --- Soft neon glow blob, used additively under signs/headlight ---
function generateNeonGlow(scene, g) {
  g.clear();
  // Concentric soft circle approximation
  for (let r = 16; r > 0; r--) {
    g.fillStyle(PALETTE.white, 0.04);
    g.fillCircle(16, 16, r);
  }
  bake(scene, g, 'glow', 32, 32);
}

// --- Title logo, drawn as a single texture (200x40) ---
function generateLogo(scene, g) {
  g.clear();
  const W = 200, H = 40;
  // Backing plate
  px(g, 0, 0, W, H, 0x000000, 0);

  // We hand-draw the words as blocky pixel letters using a tiny 5x7 font.
  drawPixelText(g, 'MIDNIGHT', 14, 4, PALETTE.neonPink, 2);
  drawPixelText(g, 'DELIVERY', 14, 22, PALETTE.neonBlue, 2);

  bake(scene, g, 'logo', W, H);
}

// --- Buttons (start / restart) ---
function generateButton(scene, g) {
  const W = 120, H = 28;
  ['btn_start', 'btn_restart'].forEach((key, i) => {
    g.clear();
    const c = i === 0 ? PALETTE.neonPink : PALETTE.neonBlue;
    // Outer bevel
    px(g, 0, 0, W, H, 0x10081a);
    px(g, 1, 1, W - 2, H - 2, 0x1f1430);
    // Neon border
    px(g, 1, 1, W - 2, 1, c);
    px(g, 1, H - 2, W - 2, 1, c);
    px(g, 1, 1, 1, H - 2, c);
    px(g, W - 2, 1, 1, H - 2, c);
    bake(scene, g, key, W, H);
  });
}

// ----- Tiny pixel font (uppercase A-Z, 0-9, space). 5 wide x 7 tall. -----
// Bits read left-to-right, top-to-bottom. 1 = pixel on.
const FONT = {
  'A':'01110 10001 10001 11111 10001 10001 10001',
  'B':'11110 10001 10001 11110 10001 10001 11110',
  'C':'01111 10000 10000 10000 10000 10000 01111',
  'D':'11110 10001 10001 10001 10001 10001 11110',
  'E':'11111 10000 10000 11110 10000 10000 11111',
  'F':'11111 10000 10000 11110 10000 10000 10000',
  'G':'01111 10000 10000 10011 10001 10001 01110',
  'H':'10001 10001 10001 11111 10001 10001 10001',
  'I':'01110 00100 00100 00100 00100 00100 01110',
  'J':'00111 00010 00010 00010 00010 10010 01100',
  'K':'10001 10010 10100 11000 10100 10010 10001',
  'L':'10000 10000 10000 10000 10000 10000 11111',
  'M':'10001 11011 10101 10101 10001 10001 10001',
  'N':'10001 11001 10101 10011 10001 10001 10001',
  'O':'01110 10001 10001 10001 10001 10001 01110',
  'P':'11110 10001 10001 11110 10000 10000 10000',
  'Q':'01110 10001 10001 10001 10101 10010 01101',
  'R':'11110 10001 10001 11110 10100 10010 10001',
  'S':'01111 10000 10000 01110 00001 00001 11110',
  'T':'11111 00100 00100 00100 00100 00100 00100',
  'U':'10001 10001 10001 10001 10001 10001 01110',
  'V':'10001 10001 10001 10001 10001 01010 00100',
  'W':'10001 10001 10001 10101 10101 11011 10001',
  'X':'10001 10001 01010 00100 01010 10001 10001',
  'Y':'10001 10001 10001 01010 00100 00100 00100',
  'Z':'11111 00001 00010 00100 01000 10000 11111',
  '0':'01110 10001 10011 10101 11001 10001 01110',
  '1':'00100 01100 00100 00100 00100 00100 01110',
  '2':'01110 10001 00001 00010 00100 01000 11111',
  '3':'11110 00001 00001 01110 00001 00001 11110',
  '4':'10001 10001 10001 11111 00001 00001 00001',
  '5':'11111 10000 11110 00001 00001 10001 01110',
  '6':'01110 10000 11110 10001 10001 10001 01110',
  '7':'11111 00001 00010 00100 01000 01000 01000',
  '8':'01110 10001 10001 01110 10001 10001 01110',
  '9':'01110 10001 10001 01111 00001 00001 01110',
  ':':'00000 00100 00000 00000 00000 00100 00000',
  ' ':'00000 00000 00000 00000 00000 00000 00000',
  '.':'00000 00000 00000 00000 00000 00000 00100',
  '!':'00100 00100 00100 00100 00100 00000 00100',
};

// drawPixelText - render text into the provided Graphics at (x,y) using PALETTE color.
// scale = pixel size multiplier. Letters are 5x7, separated by 1 pixel column.
export function drawPixelText(g, text, x, y, color, scale = 1) {
  const up = text.toUpperCase();
  let cx = x;
  for (let i = 0; i < up.length; i++) {
    const ch = up[i];
    const glyph = FONT[ch] || FONT[' '];
    const rows = glyph.split(' ');
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      for (let c = 0; c < row.length; c++) {
        if (row[c] === '1') {
          g.fillStyle(color, 1);
          g.fillRect(cx + c * scale, y + r * scale, scale, scale);
        }
      }
    }
    cx += 6 * scale;
  }
}

// drawPixelTextToTexture - convenience to bake a one-off text texture.
// Used by scenes that need a label texture rather than a Graphics object.
export function drawPixelTextToTexture(scene, key, text, color, scale = 2) {
  const tmp = scene.add.graphics({ x: 0, y: 0 });
  tmp.setVisible(false);
  const w = text.length * 6 * scale;
  const h = 7 * scale;
  drawPixelText(tmp, text, 0, 0, color, scale);
  tmp.generateTexture(key, w, h);
  tmp.destroy();
  return { width: w, height: h };
}
