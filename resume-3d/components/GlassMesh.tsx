'use client'

import { Suspense, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

/**
 * GLB bounding box (from accessor):
 *   x: [-51.25, 48.44]  → ~100 units
 *   y: [-119.94, 49.58]  → ~170 units (tallest axis = glass height)
 *   z: [-150.57, 22.96]  → ~173 units
 *
 * At scale 0.008 the glass becomes ~1.36 units tall — fits next to PH=5.0 paper.
 * y offset ≈ 0.96 so the bottom rests on the desk surface (y=0).
 */
const GLASS_SCALE = 0.008

function GlassModel() {
  const { scene } = useGLTF('/models/glass.glb')

  const cloned = useMemo(() => {
    const glassMat = new THREE.MeshPhysicalMaterial({
      transmission    : 0.92,
      roughness       : 0.05,
      ior             : 1.5,
      thickness       : 0.6,
      color           : new THREE.Color('#e8f0ff'),
      envMapIntensity : 1.8,
      clearcoat       : 0.3,
    })

    const clone = scene.clone(true)
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = glassMat
        child.castShadow    = true
        child.receiveShadow = true
      }
    })
    return clone
  }, [scene])

  return (
    <primitive
      object={cloned}
      position={[2.0, 0.96, -0.5]}
      scale={[GLASS_SCALE, GLASS_SCALE, GLASS_SCALE]}
    />
  )
}

useGLTF.preload('/models/glass.glb')

export default function GlassMesh() {
  return (
    <Suspense fallback={null}>
      <GlassModel />
    </Suspense>
  )
}
