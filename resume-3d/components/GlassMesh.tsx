'use client'

import { Suspense, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

/**
 * GLB was exported Z-up from Cinema 4D.
 * Position accessor bounds:
 *   x [-51.25, 48.44]   y [-119.94, 49.58]   z [-150.57, 22.96]
 *
 * After rotation [+π/2, 0, 0] (Z-up → Y-up), at scale 0.008:
 *   new_y range = [-0.184, 1.205]   →   1.39 units tall
 * So position_y = 0.185 puts the base exactly on the desk.
 */
function GlassModel() {
  const { scene } = useGLTF('/models/glass.glb')

  const cloned = useMemo(() => {
    const glassMat = new THREE.MeshPhysicalMaterial({
      transmission    : 0.92,
      roughness       : 0.05,
      ior             : 1.5,
      thickness       : 0.6,
      color           : new THREE.Color('#ddeeff'),
      envMapIntensity : 1.8,
      clearcoat       : 0.4,
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
      position={[2.0, 0.185, -0.5]}
      rotation={[Math.PI / 2, 0, 0]}
      scale={[0.008, 0.008, 0.008]}
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
