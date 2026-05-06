// LaneSystem
// Three road lanes positioned along the bottom third of the screen.
// Provides Y coordinates for entities and a small helper for randomly
// picking a lane that's different from a given one (used by spawner).

export class LaneSystem {
  constructor(yTop, yBottom, count = 3) {
    this.count = count;
    this.lanes = [];
    const span = yBottom - yTop;
    const step = span / (count - 1);
    for (let i = 0; i < count; i++) {
      this.lanes.push(Math.round(yTop + i * step));
    }
  }

  yFor(index) { return this.lanes[Phaser.Math.Clamp(index, 0, this.count - 1)]; }

  randomLane() { return Phaser.Math.Between(0, this.count - 1); }

  randomLaneExcept(idx) {
    let n = idx;
    while (n === idx) n = this.randomLane();
    return n;
  }
}
