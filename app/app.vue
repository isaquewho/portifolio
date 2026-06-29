<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const lenisInstance = ref<Lenis | null>(null)
const isLoaded = ref(false)

onMounted(() => {
  // Premium Console Log Message (Branding Oculto)
  console.log(
    `%c  ISAQUE.WHO  %c  IT Intern & AI Developer  \n\n%cLooking under the hood? Nice.\nCheck out the source code or get in touch!\n\nEmail: isaquediass33@gmail.com\nGitHub: https://github.com/isaquewho\nLinkedIn: https://linkedin.com/in/isaque-araujo0`,
    'background: #ccff00; color: #000; padding: 4px 8px; border-radius: 4px 0 0 4px; font-weight: bold;',
    'background: #1f2937; color: #fff; padding: 4px 8px; border-radius: 0 4px 4px 0;',
    'color: #ccff00; font-family: monospace; font-size: 12px;'
  )

  // Initialize Lenis smooth scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    gestureOrientation: 'vertical',
  })

  lenisInstance.value = lenis
  if (typeof window !== 'undefined') {
    (window as any).lenis = lenis
  }

  // Synchronize ScrollTrigger with Lenis
  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })

  gsap.ticker.lagSmoothing(0)

  // Listen for preloader finish event
  const handleFinished = () => {
    isLoaded.value = true
  }
  window.addEventListener('preloader-finished', handleFinished)
})

onUnmounted(() => {
  if (lenisInstance.value) {
    lenisInstance.value.destroy()
  }
})
</script>

<template>
  <div class="relative bg-brand-dark min-h-[100dvh] text-gray-100 overflow-x-hidden select-none">
    <Preloader />
    <Header v-if="isLoaded" />
    <main v-if="isLoaded" class="w-full max-w-full overflow-x-hidden">
      <NuxtPage />
    </main>
  </div>
</template>
