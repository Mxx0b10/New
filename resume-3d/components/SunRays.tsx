'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Volumetric-style light shafts coming through the tree canopy.
 * Implemented as transparent cones with AdditiveBlending — cheap and effective.
 * Sun direction matches SceneLights primary: from [-4, 8, 3].
 */

interface RayConfig {
  position : [number, number, number]
  rotation : [number, number, number]
  scaleBase: number
  length   : number
  baseOpacity: number
  speed    : number
  phaseOff : number
}

const RAY_CONFIGS: RayConfig[] = [
  { position: [-2.5, 7.5, -12], rotation: [ 0.30,  0.18, -0.08], scaleBase: 0.55, length: 9,  baseOpacity: 0.055, speed: 0.4, phaseOff: 0.0 },
  { position: [-0.5, 9.0, -16], rotation: [ 0.26,  0.14,  0.04], scaleBase: 0.80, length: 11, baseOpacity: 0.040, speed: 0.3, phaseOff: 1.2 },
  { position: [-4.5, 6.5, -14], rotation: [ 0.32,  0.20, -0.14], scaleBase: 0.45, length: 7,  baseOpacity: 0.050, speed: 0.5, phaseOff: 2.5 },
  { position: [ 0.8, 8.0, -13], rotation: [ 0.28,  0.10,  0.06], scaleBase: 0.35, length: 8,  baseOpacity: 0.035, speed: 0.45, phaseOff: 0.8 },
  { position: [-3.0, 7.0, -18], rotation: [ 0.22,  0.16,  0.02], scaleBase: 0.60, length: 10, baseOpacity: 0.030, speed: 0.35, phaseOff: 3.4 },
]

export default function SunRays() {
  const meshRefs = useRef<(THREE.Mesh | null)[]>([])

  const materials = useMemo(() =>
    RAY_CONFIGS.map(cfg =>
      new THREE.MeshBasicMaterial({
        color      : new THREE.Color('#FFF5C0'),
        transparent: true,
        opacity    : cfg.baseOpacity,
        side       : THREE.BackSide,
        depthWrite : false,
        blending   : THREE.AdditiveBlending,
      })
    ),
  [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    RAY_CONFIGS.forEach((cfg, i) => {
      const mat = materials[i]
      if (mat) {
        mat.opacity = cfg.baseOpacity + Math.sin(t * cfg.speed + cfg.phaseOff) * (cfg.baseOpacity * 0.3)
      }
    })
  })

  return (
    <group>
      {RAY_CONFIGS.map((cfg, i) => (
        <mesh
          key={i}
          ref={el => { meshRefs.current[i] = el }}
          position={cfg.position}
          rotation={cfg.rotation}
          scale={[cfg.scaleBase, cfg.length, cfg.scaleBase]}
          material={materials[i]}
        >
          <coneGeometry args={[1, 1, 8, 1, true]} />
        </mesh>
      ))}
    </group>
  )
}
