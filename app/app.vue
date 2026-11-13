<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const lenisInstance = ref<Lenis | null>(null)
const isLoaded = ref(false)
const route = useRoute()

onMounted(() => {
  console.log(
    '%c isaque.araujo %c Procurando o código-fonte? github.com/isaquewho ',
    'background:#ccff00;color:#000;padding:4px 8px;border-radius:4px 0 0 4px;font-weight:bold',
    'background:#1f2937;color:#fff;padding:4px 8px;border-radius:0 4px 4px 0',
  )

  const lenis = new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
  lenisInstance.value = lenis
  ;(window as any).lenis = lenis
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)

  window.addEventListener('preloader-finished', () => { isLoaded.value = true }, { once: true })
  if (route.path !== '/') isLoaded.value = true
})

onUnmounted(() => lenisInstance.value?.destroy())
</script>

<template>
  <div class="relative bg-brand-dark min-h-[100dvh] text-gray-100 overflow-x-hidden grain">
    <Preloader v-if="route.path === '/'" />
    <Header v-if="isLoaded" />
    <main class="w-full max-w-full overflow-x-hidden" :class="isLoaded ? 'opacity-100' : 'opacity-0'">
      <NuxtPage />
    </main>
  </div>
</template>
