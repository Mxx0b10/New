'use client'

import { useEffect, useState, type RefObject } from 'react'
import * as THREE from 'three'

/**
 * Captures an off-screen HTML div with html2canvas at 2× DPR
 * and returns a THREE.CanvasTexture ready for the front face material.
 *
 * html2canvas is imported dynamically to avoid SSR issues.
 */
export function useResumeTexture(ref: RefObject<HTMLDivElement>) {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null)

  useEffect(() => {
    if (!ref.current) return

    let cancelled = false

    // Small delay — let the browser fully paint the off-screen div first
    const timer = setTimeout(async () => {
      try {
        const html2canvas = (await import('html2canvas')).default
        const canvas = await html2canvas(ref.current!, {
          scale: 2, // 2× for crisp texture (matches devicePixelRatio on most screens)
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false,
          // Ensure the off-screen element is measured correctly
          scrollX: 0,
          scrollY: 0,
          windowWidth: 800,
          windowHeight: 1250,
        })

        if (cancelled) return

        const tex = new THREE.CanvasTexture(canvas)
        tex.needsUpdate = true
        tex.generateMipmaps = false
        tex.minFilter = THREE.LinearFilter
        tex.magFilter = THREE.LinearFilter
        // Flip Y so the texture reads top-to-bottom (html2canvas produces flipped UV)
        tex.flipY = true

        setTexture(tex)
      } catch (err) {
        console.error('[useResumeTexture] html2canvas failed:', err)
      }
    }, 350)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [ref])

  // Cleanup on unmount
  useEffect(() => {
    return () => { texture?.dispose() }
  }, [texture])

  return texture
}
