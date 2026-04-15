'use client'

import { useRef, useMemo, useEffect, useCallback, type MutableRefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import type { MouseCoords } from '@/hooks/useMouseParallax'

// ── Fixed scene constants ─────────────────────────────────────────────────────
const PW     = 3.2
const PH     = 5.0
const FLIP_Y = 2.6
const I_RX   = -Math.PI / 2
const I_RZ   =  0.08

// ── Responsive reading constants ──────────────────────────────────────────────
// On desktop (FOV 45°) the camera sits at z=3.2 — paper fills ~80% of view width.
// On mobile (portrait, aspect ≈ 0.46) that same z clips the paper badly.
// Solution: widen FOV to 70° + pull camera back to z=6.0 so the full paper width
// fits comfortably. The whole paper becomes visible at once, so scrolling is
// disabled on mobile (no need to pan).
const DESK_READ_Z = 3.2
const MOB_READ_Z  = 6.0
const MOB_FOV     = 70          // widened on mobile reading entry
const DESK_FOV    = 45          // default / restored on exit

function getReadBounds(readZ: number) {
  const vis = readZ * Math.tan(22.5 * Math.PI / 180)
  return {
    readTop: (FLIP_Y + PH / 2) - vis,
    readBot: (FLIP_Y - PH / 2) + vis,
  }
}

// ── Curl deformation ──────────────────────────────────────────────────────────
function applyPaperCurl(
  geo     : THREE.BufferGeometry,
  origPos : Float32Array,
  progress: number,
) {
  const attr = geo.getAttribute('position') as THREE.BufferAttribute
  const arr  = attr.array as Float32Array
  const MAX_CURL = PH * 0.38

  for (let i = 0; i < arr.length / 3; i++) {
    const oy   = origPos[i * 3 + 1]
    const p    = (oy + PH / 2) / PH
    const bend = progress * Math.pow(Math.max(0, 1 - p), 2.4) * MAX_CURL

    arr[i * 3]     = origPos[i * 3]
    arr[i * 3 + 1] = oy
    arr[i * 3 + 2] = origPos[i * 3 + 2] + bend
  }
  attr.needsUpdate = true
  geo.computeVertexNormals()
}

interface PaperMeshProps {
  resumeTexture  : THREE.CanvasTexture | null
  mouseRef       : MutableRefObject<MouseCoords>
  isMobile       : boolean
  onModeChange   : (mode: 'idle' | 'reading') => void
  onPaperSound   : (type?: 'pickup' | 'putdown') => void
}

export default function PaperMesh({
  resumeTexture,
  mouseRef,
  isMobile,
  onModeChange,
  onPaperSound,
}: PaperMeshProps) {
  const meshRef          = useRef<THREE.Mesh>(null)
  const origPos          = useRef<Float32Array | null>(null)
  const { camera, scene } = useThree()
  const pcam             = camera as THREE.PerspectiveCamera

  // ── Animation state ──────────────────────────────────────────────────────
  const st = useRef({
    isFlipped   : false,
    isAnimating : false,
    inReading   : false,
    scrollVel   : 0,
    scrollTarget: FLIP_Y,   // initialised to paper centre; reset in flipUp
    scrollNow   : FLIP_Y,
    savedCam    : new THREE.Vector3(2.5, 4, 5.5),
    savedBg     : { r: 0.788, g: 0.729, b: 0.651 },
    curlProgress: 0,
    readTop     : 0,        // computed per-mode in flipUp
    readBot     : 0,
  })

  // ── Capture flat vertex positions after mount ────────────────────────────
  useEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return
    const attr = (mesh.geometry as THREE.BufferGeometry)
      .getAttribute('position') as THREE.BufferAttribute
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
    const all = [colorMap, roughnessMap, normalMap, displacementMap]
    all.forEach(tex => {
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
    const mat = (o: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
      new THREE.MeshStandardMaterial({
        map: colorMap, roughnessMap, normalMap,
        normalScale: new THREE.Vector2(0.3, 0.3),
        displacementMap, displacementScale: 0.002,
        roughness: 0.85, metalness: 0,
        ...o,
      })
    return [
      mat(), mat(), mat(), mat(),
      new THREE.MeshStandardMaterial({
        map: resumeTexture ?? colorMap,
        roughness: 0.55, metalness: 0,
      }),
      mat({ roughness: 0.90 }),
    ] as THREE.MeshStandardMaterial[]
  }, [colorMap, roughnessMap, normalMap, displacementMap, resumeTexture])

  useEffect(() => () => materials.forEach(m => m.dispose()), [materials])

  // ── Flip up ───────────────────────────────────────────────────────────────
  const flipUp = useCallback(() => {
    const s    = st.current
    const mesh = meshRef.current
    if (s.isFlipped || s.isAnimating || !mesh) return

    // Compute read bounds for current device
    const readZ               = isMobile ? MOB_READ_Z : DESK_READ_Z
    const { readTop, readBot } = getReadBounds(readZ)
    s.readTop    = readTop
    s.readBot    = readBot
    s.isAnimating = true
    s.savedCam.copy(camera.position)
    s.scrollVel  = 0

    if (scene.background instanceof THREE.Color)
      s.savedBg = { r: scene.background.r, g: scene.background.g, b: scene.background.b }

    gsap.to(scene.background as THREE.Color, {
      r: 0.72, g: 0.77, b: 0.80, duration: 1.1, ease: 'power2.inOut',
    })

    // Play paper pickup sound
    onPaperSound('pickup')

    const tl = gsap.timeline({
      onComplete() {
        // Sync scrollNow to where the camera actually landed so the
        // transition to reading mode is a smooth scroll — not a snap.
        s.scrollNow    = camera.position.y
        s.scrollTarget = readTop          // scroll up to header smoothly
        s.isFlipped    = true
        s.isAnimating  = false
        s.inReading    = true
        onModeChange('reading')
      },
    })

    // Phase 1 — curl front edge up
    tl.to(s, { curlProgress: 1, duration: 0.42, ease: 'power2.in' })
    // Phase 2 — lift while curled
    .to(mesh.position, { y: FLIP_Y * 0.5, duration: 0.38, ease: 'power1.out' }, '-=0.18')
    // Phase 3 — uncurl + finish lift
    .to(s, { curlProgress: 0, duration: 0.52, ease: 'power2.out' }, '-=0.12')
    .to(mesh.position, { y: FLIP_Y, duration: 0.42, ease: 'power2.out' }, '-=0.48')
    // Phase 4 — rotate to face camera (spring overshoot)
    .to(mesh.rotation, { x: 0, y: 0, z: 0, duration: 0.78, ease: 'back.out(1.3)' }, '-=0.22')
    // Phase 5 — camera slides in; on mobile also widen FOV
    .to(camera.position, {
      x: 0, y: FLIP_Y, z: readZ,
      duration: 0.92, ease: 'power3.inOut',
      onUpdate() { camera.lookAt(0, camera.position.y, 0) },
    }, '-=0.54')

    if (isMobile) {
      tl.to(pcam, {
        fov: MOB_FOV,
        duration: 0.92, ease: 'power3.inOut',
        onUpdate() { pcam.updateProjectionMatrix() },
      }, '<')                               // run parallel with camera move
    }

    // Phase 6 — subtle scale breathe
    tl.to(mesh.scale, { x: 1.03, y: 1.03, z: 1.03, duration: 0.14 }, '-=0.48')
      .to(mesh.scale, { x: 1, y: 1, z: 1, duration: 0.32, ease: 'power1.inOut' })
  }, [camera, pcam, scene, isMobile, onModeChange, onPaperSound])

  // ── Put down ──────────────────────────────────────────────────────────────
  const putDown = useCallback(() => {
    const s    = st.current
    const mesh = meshRef.current
    if (!s.isFlipped || s.isAnimating || !mesh) return

    s.isAnimating = true
    s.inReading   = false

    onPaperSound('putdown')

    gsap.to(scene.background as THREE.Color, {
      ...s.savedBg, duration: 0.9, ease: 'power2.inOut',
    })

    const tl = gsap.timeline({
      onComplete() {
        s.isFlipped   = false
        s.isAnimating = false
        onModeChange('idle')
      },
    })

    // Gentle curl as paper tips
    tl.to(s, { curlProgress: 0.55, duration: 0.30, ease: 'power1.in' })
    // Rotate toward desk
    .to(mesh.rotation, { x: I_RX, y: 0, z: I_RZ, duration: 0.65, ease: 'power2.inOut' }, '-=0.10')
    // Uncurl as paper flattens
    .to(s, { curlProgress: 0, duration: 0.40, ease: 'power2.out' }, '-=0.35')
    // Drop to desk
    .to(mesh.position, { y: 0, duration: 0.46, ease: 'power2.in' }, '-=0.32')
    // Camera returns
    .to(camera.position, {
      x: s.savedCam.x, y: s.savedCam.y, z: s.savedCam.z,
      duration: 0.84, ease: 'power2.inOut',
      onUpdate() { camera.lookAt(0, 0, 0) },
    }, '-=0.40')

    // Restore FOV on mobile
    if (isMobile) {
      tl.to(pcam, {
        fov: DESK_FOV,
        duration: 0.84, ease: 'power2.inOut',
        onUpdate() { pcam.updateProjectionMatrix() },
      }, '<')
    }
  }, [camera, pcam, scene, isMobile, onModeChange, onPaperSound])

  useEffect(() => {
    ;(window as Window & { __resumePutDown?: () => void }).__resumePutDown = putDown
    return () => { delete (window as Window & { __resumePutDown?: () => void }).__resumePutDown }
  }, [putDown])

  // ── Wheel scroll ─────────────────────────────────────────────────────────
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (!st.current.inReading || isMobile) return
      e.preventDefault()
      st.current.scrollVel -= e.deltaY * 0.0022
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [isMobile])

  // ── Touch scroll ─────────────────────────────────────────────────────────
  useEffect(() => {
    let lastY = 0
    const onTS = (e: TouchEvent) => { lastY = e.touches[0].clientY }
    const onTM = (e: TouchEvent) => {
      if (!st.current.inReading || isMobile) return
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
  }, [isMobile])

  // ── Render loop ───────────────────────────────────────────────────────────
  useFrame(() => {
    const mesh = meshRef.current
    const s    = st.current
    if (!mesh) return

    // Curl deformation
    if (origPos.current) {
      const geo = mesh.geometry as THREE.BufferGeometry
      if (s.curlProgress > 0.002) {
        applyPaperCurl(geo, origPos.current, s.curlProgress)
      } else {
        const attr = geo.getAttribute('position') as THREE.BufferAttribute
        ;(attr.array as Float32Array).set(origPos.current)
        attr.needsUpdate = true
        geo.computeVertexNormals()
      }
    }

    if (s.inReading) {
      if (!isMobile) {
        // Desktop: physics scroll between readBot and readTop
        s.scrollTarget = Math.max(s.readBot, Math.min(s.readTop, s.scrollTarget + s.scrollVel))
        s.scrollVel   *= 0.80
        if (Math.abs(s.scrollVel) < 0.0001) s.scrollVel = 0
      } else {
        // Mobile: scroll only until we reach the top (readTop), then freeze
        s.scrollTarget = s.readTop
        s.scrollVel    = 0
      }
      // Smooth lerp — transitions from FLIP_Y to readTop on entry
      s.scrollNow += (s.scrollTarget - s.scrollNow) * 0.08
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

  // On mobile use scale 0.85 — slightly larger than before since reading mode
  // now zooms out, so the idle view can be a bit bigger
  const scale = isMobile ? 0.85 : 1

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
