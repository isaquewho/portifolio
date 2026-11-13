<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'

/**
 * Campo de partículas em Three.js: uma malha de pontos vista em perspectiva,
 * com ondulação suave e um "afundamento" que segue o cursor.
 * Desativa em telas pequenas e para quem prefere menos movimento.
 */
const containerRef = ref<HTMLElement | null>(null)
let cleanup: (() => void) | null = null

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uPixelRatio;
  varying float vAlpha;
  varying float vGlow;

  void main() {
    vec3 p = position;

    float wave = sin(p.x * 0.35 + uTime * 0.6) * 0.35
               + cos(p.z * 0.4 - uTime * 0.45) * 0.35;

    float d = distance(p.xz, uMouse);
    float well = smoothstep(7.0, 0.0, d);
    p.y += wave - well * 2.2;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float depth = clamp(1.0 - (-mv.z - 10.0) / 45.0, 0.0, 1.0);
    vAlpha = depth * depth;
    vGlow = well;
    gl_PointSize = (2.0 + well * 2.4) * uPixelRatio * (18.0 / -mv.z) * 1.6;
  }
`

const fragmentShader = /* glsl */ `
  varying float vAlpha;
  varying float vGlow;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    float soft = smoothstep(0.5, 0.15, r);
    vec3 base = vec3(0.55, 0.58, 0.62);
    vec3 accent = vec3(0.80, 1.0, 0.0);
    vec3 color = mix(base, accent, vGlow);
    gl_FragColor = vec4(color, soft * (0.55 + vGlow * 0.45) * vAlpha);
  }
`

onMounted(async () => {
  const el = containerRef.value
  if (!el) return
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion || window.innerWidth < 768) return

  const THREE = await import('three')

  const scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0x050505, 18, 60)

  const camera = new THREE.PerspectiveCamera(50, el.clientWidth / el.clientHeight, 0.1, 100)
  camera.position.set(0, 7, 22)
  camera.lookAt(0, -1, 0)

  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'low-power' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  renderer.setSize(el.clientWidth, el.clientHeight)
  renderer.setClearColor(0x000000, 0)
  el.appendChild(renderer.domElement)

  const cols = 110
  const rows = 70
  const spacing = 0.6
  const positions = new Float32Array(cols * rows * 3)
  let i = 0
  for (let x = 0; x < cols; x++) {
    for (let z = 0; z < rows; z++) {
      positions[i++] = (x - cols / 2) * spacing
      positions[i++] = 0
      positions[i++] = (z - rows / 2) * spacing
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const uniforms = {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(999, 999) },
    uPixelRatio: { value: renderer.getPixelRatio() },
  }
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const points = new THREE.Points(geometry, material)
  scene.add(points)

  const raycaster = new THREE.Raycaster()
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
  const ndc = new THREE.Vector2()
  const hit = new THREE.Vector3()
  const target = new THREE.Vector2(999, 999)

  const onPointerMove = (e: PointerEvent) => {
    const rect = el.getBoundingClientRect()
    ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    raycaster.setFromCamera(ndc, camera)
    if (raycaster.ray.intersectPlane(plane, hit)) target.set(hit.x, hit.z)
  }
  const onPointerLeave = () => target.set(999, 999)
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  el.addEventListener('pointerleave', onPointerLeave)

  const onResize = () => {
    camera.aspect = el.clientWidth / el.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(el.clientWidth, el.clientHeight)
  }
  window.addEventListener('resize', onResize)

  let visible = true
  const io = new IntersectionObserver(([entry]) => { visible = !!entry?.isIntersecting }, { threshold: 0.05 })
  io.observe(el)

  const clock = new THREE.Clock()
  let raf = 0
  const tick = () => {
    raf = requestAnimationFrame(tick)
    if (!visible || document.hidden) return
    uniforms.uTime.value = clock.getElapsedTime()
    uniforms.uMouse.value.lerp(target, 0.08)
    renderer.render(scene, camera)
  }
  tick()

  cleanup = () => {
    cancelAnimationFrame(raf)
    io.disconnect()
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('resize', onResize)
    el.removeEventListener('pointerleave', onPointerLeave)
    geometry.dispose()
    material.dispose()
    renderer.dispose()
    renderer.domElement.remove()
  }
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <div ref="containerRef" class="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
    <!-- Fallback estático (mobile / reduced motion) -->
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,rgba(204,255,0,0.10),transparent_60%)]"></div>
    <div class="absolute inset-0 bg-[linear-gradient(to_bottom,#050505_0%,transparent_30%,transparent_70%,#050505_100%)]"></div>
  </div>
</template>
