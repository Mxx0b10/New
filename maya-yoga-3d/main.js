import * as THREE from "three";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

const container = document.getElementById("scene-container");

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xf3ecdf, 14, 38);

const camera = new THREE.PerspectiveCamera(
  38,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 0, 14);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
container.appendChild(renderer.domElement);

// --- lights ---
scene.add(new THREE.AmbientLight(0xfff1dc, 0.55));

const key = new THREE.DirectionalLight(0xffd9a8, 1.15);
key.position.set(5, 6, 8);
scene.add(key);

const rim = new THREE.DirectionalLight(0xb8592b, 0.9);
rim.position.set(-6, -2, 4);
scene.add(rim);

const fill = new THREE.PointLight(0xfff4dd, 0.8, 25);
fill.position.set(-4, 3, 6);
scene.add(fill);

// --- subtle ground shadow disc ---
const disc = new THREE.Mesh(
  new THREE.CircleGeometry(9, 64),
  new THREE.MeshBasicMaterial({
    color: 0xb8592b,
    transparent: true,
    opacity: 0.06,
  })
);
disc.rotation.x = -Math.PI / 2;
disc.position.y = -2.4;
scene.add(disc);

// --- floating incense particles ---
const particleCount = 180;
const particleGeo = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const speeds = new Float32Array(particleCount);
for (let i = 0; i < particleCount; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 22;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
  speeds[i] = 0.15 + Math.random() * 0.35;
}
particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
const particleMat = new THREE.PointsMaterial({
  color: 0xb8592b,
  size: 0.035,
  transparent: true,
  opacity: 0.55,
  depthWrite: false,
});
const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);

// --- the 3D word ---
const WORD = "MAYAYOGA";
const lettersGroup = new THREE.Group();
scene.add(lettersGroup);

const letterMeshes = [];

// Initial ("explored") and final ("read mode") transforms per letter.
// The initial pose is a playful tilted scatter; final pose is a neat flat line.
const letterStates = [];

const fontLoader = new FontLoader();
fontLoader.load(
  "https://unpkg.com/three@0.160.0/examples/fonts/helvetiker_bold.typeface.json",
  (font) => {
    buildLetters(font);
    animate();
  }
);

function buildLetters(font) {
  const material = new THREE.MeshStandardMaterial({
    color: 0x2a1f14,
    roughness: 0.35,
    metalness: 0.15,
  });

  const letterSize = 1.25;
  const bevel = 0.04;
  const depth = 0.55;

  // First pass — build geometries to measure widths
  const geoms = [];
  let totalWidth = 0;
  const gap = 0.18;

  for (const ch of WORD) {
    const g = new TextGeometry(ch, {
      font,
      size: letterSize,
      height: depth,
      curveSegments: 10,
      bevelEnabled: true,
      bevelThickness: bevel,
      bevelSize: bevel,
      bevelSegments: 3,
    });
    g.computeBoundingBox();
    const w = g.boundingBox.max.x - g.boundingBox.min.x;
    const h = g.boundingBox.max.y - g.boundingBox.min.y;
    g.translate(-g.boundingBox.min.x, -h / 2, -depth / 2);
    geoms.push({ geometry: g, width: w });
    totalWidth += w;
  }
  totalWidth += gap * (WORD.length - 1);

  // Position each letter (final "read" layout). Initial pose is randomized below.
  let cursor = -totalWidth / 2;
  for (let i = 0; i < geoms.length; i++) {
    const { geometry, width } = geoms[i];
    const mesh = new THREE.Mesh(geometry, material);

    // Final (read-mode) transform: flat on XY plane, facing camera
    const finalPos = new THREE.Vector3(cursor + width / 2, 0, 0);
    const finalRot = new THREE.Euler(0, 0, 0);
    const finalScale = 1;

    // Initial (hero) transform: tilted, scattered in 3D
    const t = i / (geoms.length - 1); // 0..1 across the word
    const initialPos = new THREE.Vector3(
      (t - 0.5) * 10,                         // spread horizontally
      Math.sin(i * 1.3) * 1.6,                // wave vertically
      Math.cos(i * 0.9) * 2.4 - 1.2           // varied depth
    );
    const initialRot = new THREE.Euler(
      -0.55 + Math.sin(i * 1.2) * 0.25,       // pitched back
      -0.9 + (t * 1.8),                        // yaw across the word
      Math.sin(i * 2.1) * 0.18                 // slight roll
    );
    const initialScale = 1;

    mesh.position.copy(initialPos);
    mesh.rotation.copy(initialRot);
    mesh.scale.setScalar(initialScale);

    lettersGroup.add(mesh);
    letterMeshes.push(mesh);
    letterStates.push({
      initialPos, initialRot, initialScale,
      finalPos, finalRot, finalScale,
    });

    cursor += width + gap;
  }
}

// --- scroll-driven animation ---
let scrollProgress = 0;   // 0..1 across the page
let targetProgress = 0;

function updateScroll() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  targetProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
}
window.addEventListener("scroll", updateScroll, { passive: true });
updateScroll();

function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function lerpEuler(a, b, t, out) {
  out.x = a.x + (b.x - a.x) * t;
  out.y = a.y + (b.y - a.y) * t;
  out.z = a.z + (b.z - a.z) * t;
  return out;
}

const tmpEuler = new THREE.Euler();

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onResize);

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const dt = clock.getDelta();
  const time = clock.elapsedTime;

  // Smooth scroll progress
  scrollProgress += (targetProgress - scrollProgress) * Math.min(1, dt * 6);

  // The transition from "3D scatter" to "read mode" happens over the first 60%
  // of the scroll. After that the text stays flat while the reader continues down.
  const transition = easeInOutCubic(
    THREE.MathUtils.clamp(scrollProgress / 0.6, 0, 1)
  );

  // Once in read mode, gently drift the whole group upward to make room for
  // the read-mode copy below.
  const postRead = THREE.MathUtils.clamp((scrollProgress - 0.6) / 0.4, 0, 1);

  for (let i = 0; i < letterMeshes.length; i++) {
    const mesh = letterMeshes[i];
    const s = letterStates[i];

    // Floating idle motion on the initial pose
    const floatY = Math.sin(time * 0.9 + i * 0.7) * 0.08;
    const floatR = Math.sin(time * 0.6 + i) * 0.05;

    // Interpolate position
    mesh.position.x = s.initialPos.x + (s.finalPos.x - s.initialPos.x) * transition;
    mesh.position.y =
      s.initialPos.y + (s.finalPos.y - s.initialPos.y) * transition
      + floatY * (1 - transition)
      - postRead * 1.2;
    mesh.position.z = s.initialPos.z + (s.finalPos.z - s.initialPos.z) * transition;

    // Interpolate rotation to 0 (facing camera)
    lerpEuler(s.initialRot, s.finalRot, transition, tmpEuler);
    mesh.rotation.x = tmpEuler.x + floatR * (1 - transition);
    mesh.rotation.y = tmpEuler.y;
    mesh.rotation.z = tmpEuler.z;
  }

  // Camera gently pulls closer as we enter read mode
  const camZ = 14 - transition * 2.2 + postRead * 0.6;
  camera.position.z += (camZ - camera.position.z) * Math.min(1, dt * 5);
  const camY = postRead * 0.6;
  camera.position.y += (camY - camera.position.y) * Math.min(1, dt * 5);
  camera.lookAt(0, camera.position.y * 0.4, 0);

  // Drift particles upward like incense smoke
  const pos = particles.geometry.attributes.position.array;
  for (let i = 0; i < particleCount; i++) {
    pos[i * 3 + 1] += speeds[i] * dt * 0.25;
    if (pos[i * 3 + 1] > 7) {
      pos[i * 3 + 1] = -7;
      pos[i * 3] = (Math.random() - 0.5) * 22;
    }
  }
  particles.geometry.attributes.position.needsUpdate = true;

  renderer.render(scene, camera);
}
