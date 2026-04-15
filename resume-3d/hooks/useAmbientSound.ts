'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * Procedural ambient nature sounds — no audio files required.
 * Generates three layers via Web Audio API:
 *  1. Wind — pink-ish filtered noise
 *  2. Crickets / insects — amplitude-modulated high-frequency tones
 *  3. Bird chirps — occasional random melodic sweeps
 *
 * Audio starts on the first user interaction (browser autoplay policy).
 */
export function useAmbientSound() {
  const [muted,   setMuted  ] = useState(true)
  const [started, setStarted] = useState(false)
  const [volume,  setVolumeSt] = useState(0.7)
  const ctxRef    = useRef<AudioContext | null>(null)
  const masterRef = useRef<GainNode | null>(null)
  const volumeRef = useRef(0.7)   // shadow ref — avoids stale closures

  // ── Build the audio graph ───────────────────────────────────────────────
  const startAudio = useCallback(() => {
    if (started) return
    setStarted(true)

    const ctx = new (window.AudioContext ||
      (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    ctxRef.current = ctx

    const master = ctx.createGain()
    master.gain.value = 0   // start silent — user must unmute
    master.connect(ctx.destination)
    masterRef.current = master

    // ── 1. Wind (filtered white noise, looped 4s buffer) ────────────────
    const windBuf  = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate)
    const windData = windBuf.getChannelData(0)
    let lastSample = 0
    for (let i = 0; i < windData.length; i++) {
      // Simple pink-ish noise via first-order IIR
      lastSample = 0.995 * lastSample + 0.005 * (Math.random() * 2 - 1)
      windData[i] = lastSample * 14   // amplify after low-pass
    }
    const windSrc = ctx.createBufferSource()
    windSrc.buffer = windBuf
    windSrc.loop   = true
    const windBP   = ctx.createBiquadFilter()
    windBP.type    = 'bandpass'
    windBP.frequency.value = 500
    windBP.Q.value = 0.4
    const windGain = ctx.createGain()
    windGain.gain.value = 0.055
    windSrc.connect(windBP)
    windBP.connect(windGain)
    windGain.connect(master)
    windSrc.start()

    // ── 2. Crickets (3 detuned AM oscillators, looped 3s buffer) ────────
    const cBuf  = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate)
    const cData = cBuf.getChannelData(0)
    for (let i = 0; i < cData.length; i++) {
      const t  = i / ctx.sampleRate
      const g1 = Math.sin(2 * Math.PI * 22 * t)          > 0.4 ? 1 : 0
      const g2 = Math.sin(2 * Math.PI * 19 * t + 1.1)   > 0.4 ? 1 : 0
      const g3 = Math.sin(2 * Math.PI * 24 * t + 2.3)   > 0.4 ? 1 : 0
      const s  = Math.sin(2 * Math.PI * 4200 * t) * g1 * 0.4
               + Math.sin(2 * Math.PI * 3850 * t) * g2 * 0.35
               + Math.sin(2 * Math.PI * 4480 * t) * g3 * 0.3
      cData[i] = s * 0.028
    }
    const cSrc  = ctx.createBufferSource()
    cSrc.buffer = cBuf
    cSrc.loop   = true
    const cGain = ctx.createGain()
    cGain.gain.value = 0.7
    cSrc.connect(cGain)
    cGain.connect(master)
    cSrc.start()

    // ── 3. Bird chirps (scheduled sweeps every 4–10 s) ──────────────────
    const scheduleChirp = () => {
      if (!ctxRef.current || ctxRef.current.state === 'closed') return
      const osc  = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(master)

      const now    = ctx.currentTime
      const startF = 1800 + Math.random() * 800
      const endF   = startF + 400 + Math.random() * 600
      const dur    = 0.12 + Math.random() * 0.14

      osc.type = 'sine'
      osc.frequency.setValueAtTime(startF, now)
      osc.frequency.linearRampToValueAtTime(endF,   now + dur * 0.5)
      osc.frequency.linearRampToValueAtTime(startF, now + dur)

      gain.gain.setValueAtTime(0, now)
      gain.gain.linearRampToValueAtTime(0.06, now + 0.02)
      gain.gain.linearRampToValueAtTime(0,    now + dur)

      osc.start(now)
      osc.stop(now + dur + 0.05)
      osc.onended = () => {
        // 1–3 quick repeats then a long pause
        const repeats = Math.floor(Math.random() * 3)
        let delay = 0.18
        for (let r = 0; r < repeats; r++) {
          const d = delay
          setTimeout(() => scheduleChirpAt(ctx, master, startF, endF, dur), d * 1000)
          delay += 0.22
        }
        setTimeout(scheduleChirp, (4 + Math.random() * 6) * 1000)
      }
    }

    // Helper used by repeats
    const scheduleChirpAt = (
      c: AudioContext, dest: AudioNode,
      startF: number, endF: number, dur: number,
    ) => {
      const o = c.createOscillator()
      const g = c.createGain()
      o.connect(g); g.connect(dest)
      const now = c.currentTime
      o.type = 'sine'
      o.frequency.setValueAtTime(startF, now)
      o.frequency.linearRampToValueAtTime(endF,   now + dur * 0.5)
      o.frequency.linearRampToValueAtTime(startF, now + dur)
      g.gain.setValueAtTime(0, now)
      g.gain.linearRampToValueAtTime(0.045, now + 0.02)
      g.gain.linearRampToValueAtTime(0, now + dur)
      o.start(now); o.stop(now + dur + 0.05)
    }

    setTimeout(scheduleChirp, 1500 + Math.random() * 2000)
  }, [started])

  // ── Start on first interaction ─────────────────────────────────────────
  useEffect(() => {
    const handler = () => startAudio()
    window.addEventListener('click',     handler, { once: true })
    window.addEventListener('touchstart', handler, { once: true })
    return () => {
      window.removeEventListener('click',     handler)
      window.removeEventListener('touchstart', handler)
    }
  }, [startAudio])

  // ── Cleanup ────────────────────────────────────────────────────────────
  useEffect(() => () => { ctxRef.current?.close() }, [])

  // ── Toggle mute ────────────────────────────────────────────────────────
  const toggleMute = useCallback(() => {
    if (!masterRef.current || !ctxRef.current) return
    const next = !muted
    masterRef.current.gain.setTargetAtTime(
      next ? 0 : volumeRef.current * 0.55,
      ctxRef.current.currentTime,
      0.15,
    )
    setMuted(next)
  }, [muted])

  // ── Set volume (0–1) ────────────────────────────────────────────────────
  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v))
    volumeRef.current = clamped
    setVolumeSt(clamped)
    if (!masterRef.current || !ctxRef.current) return
    if (!muted) {
      masterRef.current.gain.setTargetAtTime(
        clamped * 0.55,
        ctxRef.current.currentTime,
        0.05,
      )
    }
  }, [muted])

  // ── Paper rustle sound ─────────────────────────────────────────────────
  const playPaperRustle = useCallback((type: 'pickup' | 'putdown' = 'pickup') => {
    const ctx    = ctxRef.current
    const master = masterRef.current
    if (!ctx || !master) return

    const dur  = type === 'pickup' ? 0.22 : 0.14
    const freq = type === 'pickup' ? 3200  : 2600

    const bufSize = Math.floor(ctx.sampleRate * dur)
    const buf     = ctx.createBuffer(1, bufSize, ctx.sampleRate)
    const data    = buf.getChannelData(0)
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1

    const src  = ctx.createBufferSource()
    src.buffer = buf

    // High-pass + band-pass gives that crisp paper character
    const hp  = ctx.createBiquadFilter()
    hp.type   = 'highpass'
    hp.frequency.value = 1200

    const bp  = ctx.createBiquadFilter()
    bp.type   = 'bandpass'
    bp.frequency.value = freq
    bp.Q.value = 1.4

    const gain = ctx.createGain()
    const now  = ctx.currentTime
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(volumeRef.current * 0.55, now + 0.007)
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur)

    src.connect(hp)
    hp.connect(bp)
    bp.connect(gain)
    gain.connect(master)
    src.start(now)
    src.stop(now + dur + 0.05)
  }, [])

  return { muted, toggleMute, volume, setVolume, playPaperRustle, started }
}
