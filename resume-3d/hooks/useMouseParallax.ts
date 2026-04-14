'use client'

import { useEffect, useRef } from 'react'

export interface MouseCoords {
  x: number // -1 to 1 (left to right)
  y: number // -1 to 1 (bottom to top)
}

/**
 * Tracks mouse position normalised to -1…1 on each axis.
 * Returns a stable ref so PaperMesh can read it every frame
 * without re-renders or stale closures.
 */
export function useMouseParallax() {
  const mouseRef = useRef<MouseCoords>({ x: 0, y: 0 })

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(((e.clientY / window.innerHeight) * 2) - 1)
    }

    // Touch support
    function handleTouch(e: TouchEvent) {
      const t = e.touches[0]
      if (!t) return
      mouseRef.current.x = (t.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(((t.clientY / window.innerHeight) * 2) - 1)
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    window.addEventListener('touchmove', handleTouch, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('touchmove', handleTouch)
    }
  }, [])

  return mouseRef
}
