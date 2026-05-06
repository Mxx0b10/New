// AudioGenerator
// Procedurally synthesises every sound in the game via the Web Audio API,
// so the game has zero audio asset dependencies. Built as a small singleton
// that scenes can call directly.
//
// Audio is gated behind a user gesture (Phaser handles this for us as long
// as the AudioContext is created/resumed in response to a click/key press).

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.musicGain = null;
    this.sfxGain = null;
    this._engineNode = null;
    this._musicLoopHandle = null;
    this._musicStep = 0;
    this.muted = false;
  }

  // Lazily create the AudioContext. Must be called from a user gesture handler.
  init() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.6;
    this.master.connect(this.ctx.destination);

    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = 0.18;
    this.musicGain.connect(this.master);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = 0.5;
    this.sfxGain.connect(this.master);
  }

  setMuted(m) {
    this.muted = m;
    if (this.master) this.master.gain.value = m ? 0 : 0.6;
  }

  // ---------- One-shot SFX ----------
  coin() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    [880, 1320].forEach((f, i) => {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = 'square';
      o.frequency.setValueAtTime(f, t + i * 0.06);
      g.gain.setValueAtTime(0.0001, t + i * 0.06);
      g.gain.exponentialRampToValueAtTime(0.25, t + i * 0.06 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.06 + 0.18);
      o.connect(g).connect(this.sfxGain);
      o.start(t + i * 0.06);
      o.stop(t + i * 0.06 + 0.2);
    });
  }

  spill() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    // Filtered noise burst
    const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.25, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const filt = this.ctx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.value = 900;
    const g = this.ctx.createGain();
    g.gain.value = 0.4;
    src.connect(filt).connect(g).connect(this.sfxGain);
    src.start(t);
  }

  crash() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.45, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const filt = this.ctx.createBiquadFilter();
    filt.type = 'bandpass';
    filt.frequency.value = 400;
    filt.Q.value = 0.8;
    const g = this.ctx.createGain();
    g.gain.value = 0.55;
    src.connect(filt).connect(g).connect(this.sfxGain);
    src.start(t);

    // low thud
    const o = this.ctx.createOscillator();
    const og = this.ctx.createGain();
    o.frequency.setValueAtTime(120, t);
    o.frequency.exponentialRampToValueAtTime(40, t + 0.3);
    og.gain.setValueAtTime(0.3, t);
    og.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    o.connect(og).connect(this.sfxGain);
    o.start(t);
    o.stop(t + 0.4);
  }

  uiClick() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = 'square';
    o.frequency.setValueAtTime(560, t);
    o.frequency.exponentialRampToValueAtTime(220, t + 0.08);
    g.gain.setValueAtTime(0.18, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    o.connect(g).connect(this.sfxGain);
    o.start(t);
    o.stop(t + 0.1);
  }

  // ---------- Continuous scooter engine drone ----------
  // A simple sawtooth + slight noise filter, with a control input for "speed".
  startEngine() {
    if (!this.ctx || this._engineNode) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = 90;

    const subOsc = ctx.createOscillator();
    subOsc.type = 'square';
    subOsc.frequency.value = 45;

    const filt = ctx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.value = 700;
    filt.Q.value = 4;

    const g = ctx.createGain();
    g.gain.value = 0.06;

    osc.connect(filt);
    subOsc.connect(filt);
    filt.connect(g).connect(this.sfxGain);
    osc.start();
    subOsc.start();

    this._engineNode = { osc, subOsc, g, filt };
  }

  setEngineIntensity(v) {
    // v in [0..1]; scales pitch + filter
    if (!this._engineNode) return;
    const t = this.ctx.currentTime;
    const e = this._engineNode;
    e.osc.frequency.linearRampToValueAtTime(80 + v * 70, t + 0.15);
    e.subOsc.frequency.linearRampToValueAtTime(40 + v * 30, t + 0.15);
    e.filt.frequency.linearRampToValueAtTime(500 + v * 1200, t + 0.15);
    e.g.gain.linearRampToValueAtTime(0.04 + v * 0.06, t + 0.15);
  }

  stopEngine() {
    if (!this._engineNode) return;
    const t = this.ctx.currentTime;
    this._engineNode.g.gain.linearRampToValueAtTime(0.0001, t + 0.2);
    setTimeout(() => {
      try {
        this._engineNode.osc.stop();
        this._engineNode.subOsc.stop();
      } catch (e) { /* already stopped */ }
      this._engineNode = null;
    }, 250);
  }

  // ---------- Lo-fi background music ----------
  // A tiny generative loop: bass note + sparse melody pings over a kick pulse.
  // Intentionally minimal so it sits behind gameplay rather than competing with it.
  startMusic() {
    if (!this.ctx || this._musicLoopHandle) return;
    const ctx = this.ctx;
    const tempoMs = 380; // 16th-ish at ~80bpm

    // Pentatonic-ish minor scale, A natural minor pent: A C D E G
    const scale = [220.00, 261.63, 293.66, 329.63, 392.00, 440.00];
    const bassNotes = [110.00, 146.83, 130.81, 164.81]; // A E C E

    let step = 0;
    const tick = () => {
      const t = ctx.currentTime;

      // Kick on every 4th step
      if (step % 4 === 0) {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.frequency.setValueAtTime(110, t);
        o.frequency.exponentialRampToValueAtTime(40, t + 0.15);
        g.gain.setValueAtTime(0.25, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        o.connect(g).connect(this.musicGain);
        o.start(t);
        o.stop(t + 0.2);
      }

      // Bass on every 8th step
      if (step % 8 === 0) {
        const f = bassNotes[(step / 8) % bassNotes.length | 0];
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'triangle';
        o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.18, t + 0.04);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
        o.connect(g).connect(this.musicGain);
        o.start(t);
        o.stop(t + 0.75);
      }

      // Sparse melody pings - random scale note about 25% of the time
      if (Math.random() < 0.28) {
        const f = scale[Math.floor(Math.random() * scale.length)] * (Math.random() < 0.3 ? 2 : 1);
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.06, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
        o.connect(g).connect(this.musicGain);
        o.start(t);
        o.stop(t + 0.55);
      }

      step++;
    };

    this._musicLoopHandle = setInterval(tick, tempoMs);
  }

  stopMusic() {
    if (this._musicLoopHandle) {
      clearInterval(this._musicLoopHandle);
      this._musicLoopHandle = null;
    }
  }
}

export const Audio = new AudioEngine();
