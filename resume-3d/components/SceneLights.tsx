'use client'

/**
 * Lighting tuned to match the reference image:
 * - Warm ambient fill (beige/cream tone)
 * - Primary sun from upper-left — creates the soft shadow across the paper
 * - Secondary soft fill from right — keeps shadows from going too dark
 * - Subtle back rim for depth
 */
export default function SceneLights() {
  return (
    <>
      {/* Warm ambient — lifts shadows to a warm cream tone */}
      <ambientLight intensity={0.55} color="#fff5e8" />

      {/* Primary sun — upper-left, matches reference shadow direction */}
      <directionalLight
        position={[-4, 8, 3]}
        intensity={1.4}
        color="#fff8ee"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.0015}
      />

      {/* Soft fill from the right — prevents harsh shadow on paper */}
      <directionalLight
        position={[6, 4, 2]}
        intensity={0.32}
        color="#dde8f5"
      />

      {/* Subtle back-rim for cinematic depth */}
      <directionalLight
        position={[0, 3, -7]}
        intensity={0.12}
        color="#ffeedd"
      />
    </>
  )
}
