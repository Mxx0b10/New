'use client'

import { useRef, useMemo, useEffect, useCallback, type MutableRefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import type { MouseCoords } from '@/hooks/useMouseParallax'

// ── Scene constants ──────────────────────────────────────────────────────────
const PW      = 3.2
const PH      = 5.0
const FLIP_Y  = 2.6
const READ_Z  = 3.2
const VIS      = READ_Z * Math.tan(22.5 * Math.PI / 180)
const READ_TOP = (FLIP_Y + PH / 2) - VIS
const READ_BOT = (FLIP_Y - PH / 2) + VIS
const I_RX    = -Math.PI / 2
const I_RZ    =  0.08

// ── Curl deformation helper ───────────────────────────────────────────────────
// Applied to the BoxGeometry vertices every frame when curlProgress > 0.
// Bends the front edge (local y = -PH/2) upward along local +z so it looks
// like a real paper being picked up from the desk.
function applyPaperCurl(
  geo       : THREE.BufferGeometry,
  origPos   : Float32Array,
  progress  : number,            // 0 = flat, 1 = max curl
) {
  const attr = geo.getAttribute('position') as THREE.BufferAttribute
  const arr  = attr.array as Float32Array
  const MAX_CURL = PH * 0.38    // front edge lifts ~1.9 units at full curl

  for (let i = 0; i < arr.length / 3; i++) {
    const oy = origPos[i * 3 + 1]
    // p=0 at bottom/front (y=-PH/2), p=1 at top/back (y=+PH/2)
    const p = (oy + PH / 2) / PH
    // Quadratic fall-off: bottom gets full curl, top gets none
    const bend = progress * Math.pow(Math.max(0, 1 - p), 2.4) * MAX_CURL

    arr[i * 3]     = origPos[i * 3]
    arr[i * 3 + 1] = oy
    arr[i * 3 + 2] = origPos[i * 3 + 2] + bend
  }
  attr.needsUpdate = true
  geo.computeVertexNormals()
}

interface PaperMeshProps {
  resumeTexture : THREE.CanvasTexture | null
  mouseRef      : MutableRefObject<MouseCoords>
  isMobile      : boolean
  onModeChange  : (mode: 'idle' | 'reading') => void
}

export default function PaperMesh({
  resumeTexture,
  mouseRef,
  isMobile,
  onModeChange,
}: PaperMeshProps) {
  const meshRef   = useRef<THREE.Mesh>(null)
  const origPos   = useRef<Float32Array | null>(null)   // snapshot of flat vertex positions
  const { camera, scene } = useThree()

  // ── Animation state ──────────────────────────────────────────────────────
  const st = useRef({
    isFlipped   : false,
    isAnimating : false,
    inReading   : false,
    scrollVel   : 0,
    scrollTarget: READ_TOP,
    scrollNow   : READ_TOP,
    savedCam    : new THREE.Vector3(2.5, 4, 5.5),
    savedBg     : { r: 0.788, g: 0.729, b: 0.651 },
    curlProgress: 0,               // 0=flat  1=fully curled
  })

  // ── Capture original vertex positions after mount ─────────────────────────
  useEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return
    const attr = (mesh.geometry as THREE.BufferGeometry).getAttribute('position') as THREE.BufferAttribute
    origPos.current = new Float32Array(attr.array)
  }, [])

  // ── PBR texture maps ──────────────────────────────────────────────────────
  const [colorMap, roughnessMap, normalMap, displacementMap] = useTexture([
    '/textures/paper-color.jpg',
    '/textures/paper-roughness.jpg',
    '/textures/paper-normal.jpg',
    '/textures/paper-displacement.jpg',
  ])

  useMemo(() => {
    const allMaps = [colorMap, roughnessMap, normalMap, displacementMap]
    allMaps.forEach(tex => {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping
      tex.repeat.set(1, 1.4)
      tex.needsUpdate = true
    })
    roughnessMap.colorSpace    = THREE.NoColorSpace
    normalMap.colorSpace       = THREE.NoColorSpace
    displacementMap.colorSpace = THREE.NoColorSpace
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorMap, roughnessMap, normalMap, displacementMap])

  // ── 6-material array ──────────────────────────────────────────────────────
  const materials = useMemo(() => {
    const paperMat = (overrides: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
      new THREE.MeshStandardMaterial({
        map: colorMap, roughnessMap, normalMap,
        normalScale: new THREE.Vector2(0.3, 0.3),
        displacementMap, displacementScale: 0.002,
        roughness: 0.85, metalness: 0.0,
        ...overrides,
      })
    return [
      paperMat(),
      paperMat(),
      paperMat(),
      paperMat(),
      new THREE.MeshStandardMaterial({
        map: resumeTexture ?? colorMap,
        roughness: 0.55, metalness: 0.0,
      }),
      paperMat({ roughness: 0.90 }),
    ] as THREE.MeshStandardMaterial[]
  }, [colorMap, roughnessMap, normalMap, displacementMap, resumeTexture])

  useEffect(() => () => materials.forEach(m => m.dispose()), [materials])

  // ── Flip up (physics roll) ────────────────────────────────────────────────
  const flipUp = useCallback(() => {
    const s    = st.current
    const mesh = meshRef.current
    if (s.isFlipped || s.isAnimating || !mesh) return

    s.isAnimating  = true
    s.savedCam.copy(camera.position)
    s.scrollTarget = READ_TOP
    s.scrollNow    = READ_TOP
    s.scrollVel    = 0

    if (scene.background instanceof THREE.Color)
      s.savedBg = { r: scene.background.r, g: scene.background.g, b: scene.background.b }

    gsap.to(scene.background as THREE.Color, {
      r: 0.72, g: 0.77, b: 0.80, duration: 1.1, ease: 'power2.inOut',
    })

    gsap.timeline({
      onComplete() {
        s.isFlipped   = true
        s.isAnimating = false
        s.inReading   = true
        onModeChange('reading')
      },
    })
    // Phase 1 — front edge curls up (paper peeling off desk)
    .to(s, {
      curlProgress: 1,
      duration: 0.42,
      ease: 'power2.in',
    })
    // Phase 2 — lift while still curled
    .to(mesh.position, {
      y: FLIP_Y * 0.5,
      duration: 0.38,
      ease: 'power1.out',
    }, '-=0.18')
    // Phase 3 — begin uncurl + continue lift
    .to(s, {
      curlProgress: 0,
      duration: 0.52,
      ease: 'power2.out',
    }, '-=0.12')
    .to(mesh.position, {
      y: FLIP_Y,
      duration: 0.42,
      ease: 'power2.out',
    }, '-=0.48')
    // Phase 4 — rotate to face camera with spring overshoot
    .to(mesh.rotation, {
      x: 0, y: 0, z: 0,
      duration: 0.78,
      ease: 'back.out(1.3)',
    }, '-=0.22')
    // Phase 5 — camera slides in
    .to(camera.position, {
      x: 0, y: FLIP_Y, z: READ_Z,
      duration: 0.92,
      ease: 'power3.inOut',
      onUpdate() { camera.lookAt(0, camera.position.y, 0) },
    }, '-=0.54')
    // Phase 6 — subtle scale breathe
    .to(mesh.scale, { x: 1.03, y: 1.03, z: 1.03, duration: 0.14 }, '-=0.48')
    .to(mesh.scale, { x: 1,    y: 1,    z: 1,    duration: 0.32, ease: 'power1.inOut' })
  }, [camera, scene, onModeChange])

  // ── Put down (physics settle) ─────────────────────────────────────────────
  const putDown = useCallback(() => {
    const s    = st.current
    const mesh = meshRef.current
    if (!s.isFlipped || s.isAnimating || !mesh) return

    s.isAnimating = true
    s.inReading   = false

    gsap.to(scene.background as THREE.Color, {
      ...s.savedBg, duration: 0.9, ease: 'power2.inOut',
    })

    gsap.timeline({
      onComplete() {
        s.isFlipped   = false
        s.isAnimating = false
        onModeChange('idle')
      },
    })
    // Gentle curl as paper starts to tip over
    .to(s, { curlProgress: 0.55, duration: 0.30, ease: 'power1.in' })
    // Rotate toward desk
    .to(mesh.rotation, { x: I_RX, y: 0, z: I_RZ, duration: 0.65, ease: 'power2.inOut' }, '-=0.10')
    // Uncurl as it approaches flat
    .to(s, { curlProgress: 0, duration: 0.40, ease: 'power2.out' }, '-=0.35')
    // Drop to desk
    .to(mesh.position, { y: 0, duration: 0.46, ease: 'power2.in' }, '-=0.32')
    // Camera returns
    .to(camera.position, {
      x: s.savedCam.x, y: s.savedCam.y, z: s.savedCam.z,
      duration: 0.84, ease: 'power2.inOut',
      onUpdate() { camera.lookAt(0, 0, 0) },
    }, '-=0.40')
  }, [camera, scene, onModeChange])

  useEffect(() => {
    ;(window as Window & { __resumePutDown?: () => void }).__resumePutDown = putDown
    return () => { delete (window as Window & { __resumePutDown?: () => void }).__resumePutDown }
  }, [putDown])

  // ── Scroll ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (!st.current.inReading) return
      e.preventDefault()
      st.current.scrollVel -= e.deltaY * 0.0022
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [])

  useEffect(() => {
    let lastY = 0
    const onTS = (e: TouchEvent) => { lastY = e.touches[0].clientY }
    const onTM = (e: TouchEvent) => {
      if (!st.current.inReading) return
      e.preventDefault()
      st.current.scrollVel -= (lastY - e.touches[0].clientY) * 0.003
      lastY = e.touches[0].clientY
    }
    window.addEventListener('touchstart', onTS, { passive: true })
    window.addEventListener('touchmove',  onTM, { passive: false })
    return () => {
      window.removeEventListener('touchstart', onTS)
      window.removeEventListener('touchmove',  onTM)
    }
  }, [])

  // ── Render loop ───────────────────────────────────────────────────────────
  useFrame(() => {
    const mesh = meshRef.current
    const s    = st.current
    if (!mesh) return

    // ── Curl deformation ──────────────────────────────────────────────────
    if (origPos.current) {
      const geo = mesh.geometry as THREE.BufferGeometry
      if (s.curlProgress > 0.002) {
        applyPaperCurl(geo, origPos.current, s.curlProgress)
      } else {
        // Snap back to perfectly flat — avoids floating-point drift
        const attr = geo.getAttribute('position') as THREE.BufferAttribute
        ;(attr.array as Float32Array).set(origPos.current)
        attr.needsUpdate = true
        geo.computeVertexNormals()
      }
    }

    if (s.inReading) {
      s.scrollTarget = Math.max(READ_BOT, Math.min(READ_TOP, s.scrollTarget + s.scrollVel))
      s.scrollVel   *= 0.80
      if (Math.abs(s.scrollVel) < 0.0001) s.scrollVel = 0
      s.scrollNow   += (s.scrollTarget - s.scrollNow) * 0.10
      camera.position.y = s.scrollNow
      camera.lookAt(0, s.scrollNow, 0)
      return
    }

    // Idle float
    if (!s.isFlipped && !s.isAnimating)
      mesh.position.y = Math.sin(Date.now() * 0.0013) * 0.013

    // Mouse parallax
    if (!s.isAnimating && !s.isFlipped) {
      const { x } = mouseRef.current
      mesh.rotation.z = THREE.MathUtils.lerp(mesh.rotation.z, I_RZ + x * 0.016, 0.04)
    }
  })

  const scale = isMobile ? 0.75 : 1

  return (
    <mesh
      ref={meshRef}
      position={[0, 0, 0]}
      rotation={[I_RX, 0, I_RZ]}
      scale={[scale, scale, scale]}
      material={materials}
      castShadow
      receiveShadow
      onClick={(e) => {
        e.stopPropagation()
        if (!st.current.isFlipped && !st.current.isAnimating) flipUp()
      }}
    >
      {/* 12×24 segments — enough resolution for smooth curl deformation */}
      <boxGeometry args={[PW, PH, 0.012, 12, 24, 1]} />
    </mesh>
  )
}
