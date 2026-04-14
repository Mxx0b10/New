'use client'

import { Suspense, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Low-poly tree scene backdrop.
 *
 * GLB bounding box (scale 1):
 *   x [-6.76 → 5.57]  ~12 units wide
 *   y [-6.22 → 5.99]  ~12 units tall
 *   z [-26.19 → 0.24] ~26 units deep (extends into -z)
 *
 * At scale 4 the scene becomes ~48 × 48 × 104 units — large enough to
 * surround the desk from behind and both sides without visible edges.
 *
 * Position [-1, -0.5, -10]:
 *   • Pushed into -z so trees appear behind the desk/paper
 *   • Slight -y so the terrain sits just below the desk surface
 */

function TreeModel() {
  const { scene } = useGLTF('/models/tree-scene.glb')

  // Clone once and strip every shadow — 2712 shadow casters would be fatal
  const cloned = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse((child) => {
      child.castShadow    = false
      child.receiveShadow = false
      // Keep frustum culling on so off-screen trees are skipped
    })
    return clone
  }, [scene])

  return (
    <primitive
      object={cloned}
      position={[-1, -0.5, -10]}
      scale={[4, 4, 4]}
    />
  )
}

useGLTF.preload('/models/tree-scene.glb')

export default function TreeScene() {
  return (
    <Suspense fallback={null}>
      <TreeModel />
    </Suspense>
  )
}
