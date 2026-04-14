/**
 * Procedural paper texture — matches the reference: clean white/off-white
 * printer paper with barely-visible fine grain and occasional horizontal fibers.
 *
 * Used in two places:
 *  1. ResumeContent HTML background → baked into html2canvas output
 *  2. THREE.CanvasTexture on paper mesh side/back faces
 */
export function createPaperCanvas(w: number, h: number): HTMLCanvasElement {
  const cv  = document.createElement('canvas')
  cv.width  = w
  cv.height = h
  const ctx = cv.getContext('2d')!

  // ── Base coat: warm near-white ──────────────────────────────────────────
  ctx.fillStyle = '#F9F8F6'
  ctx.fillRect(0, 0, w, h)

  // ── Fine speckle grain (like the uploaded image) ────────────────────────
  // Very small 0.3–1.4 px dots at very low opacity — the main texture component
  const dotCount = Math.round(w * h * 0.18)
  for (let i = 0; i < dotCount; i++) {
    const x  = Math.random() * w
    const y  = Math.random() * h
    const a  = Math.random() * 0.028
    const s  = Math.random() * 1.1 + 0.25
    // Slight warm bias to the grain color
    const r  = 80  + Math.floor(Math.random() * 35)
    const g  = 72  + Math.floor(Math.random() * 28)
    const b  = 58  + Math.floor(Math.random() * 22)
    ctx.fillStyle = `rgba(${r},${g},${b},${a})`
    ctx.fillRect(x, y, s, s)
  }

  // ── Occasional very faint fiber lines (horizontal bias) ─────────────────
  for (let i = 0; i < Math.round(w * 0.12); i++) {
    const y   = Math.random() * h
    const x0  = Math.random() * w
    const len = Math.random() * 55 + 8
    const a   = Math.random() * 0.013
    const dy  = (Math.random() - 0.5) * 0.8  // nearly horizontal
    ctx.strokeStyle = `rgba(95,85,68,${a})`
    ctx.lineWidth   = Math.random() * 0.28 + 0.08
    ctx.beginPath()
    ctx.moveTo(x0, y)
    ctx.lineTo(x0 + len, y + dy)
    ctx.stroke()
  }

  // ── Subtle vignette to prevent hard tile edges ───────────────────────────
  const vg = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, h * 0.85)
  vg.addColorStop(0, 'rgba(0,0,0,0)')
  vg.addColorStop(1, 'rgba(0,0,0,0.022)')
  ctx.fillStyle = vg
  ctx.fillRect(0, 0, w, h)

  return cv
}

/**
 * Returns a small tiling paper canvas (512 × 512) for use as a
 * THREE.CanvasTexture on mesh faces.
 */
export function createTilingPaperCanvas(): HTMLCanvasElement {
  return createPaperCanvas(512, 512)
}

/**
 * Returns the paper canvas as a data-URL string, suitable for use as a CSS
 * background-image in ResumeContent so html2canvas bakes it in.
 */
export function paperDataURL(w = 800, h = 1131): string {
  return createPaperCanvas(w, h).toDataURL('image/jpeg', 0.96)
}
