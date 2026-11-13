<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'

/** Preloader curto e real: espera fontes carregarem (máximo 1,2 s) e sai. */
const rootRef = ref<HTMLElement | null>(null)
const done = ref(false)

onMounted(async () => {
  const started = performance.now()
  const fonts = (document as any).fonts?.ready ?? Promise.resolve()
  await Promise.race([fonts, new Promise((r) => setTimeout(r, 1200))])
  const minimo = Math.max(0, 500 - (performance.now() - started))
  await new Promise((r) => setTimeout(r, minimo))

  window.dispatchEvent(new CustomEvent('preloader-finished'))
  gsap.to(rootRef.value, {
    yPercent: -100,
    duration: 0.9,
    ease: 'power4.inOut',
    onComplete: () => { done.value = true },
  })
})
</script>

<template>
  <div v-if="!done" ref="rootRef" class="fixed inset-0 z-50 bg-brand-dark flex items-center justify-center" aria-hidden="true">
    <div class="flex items-center gap-3">
      <span class="h-2 w-2 rounded-full bg-brand-accent animate-pulse"></span>
      <span class="font-display font-bold tracking-tight text-white text-xl">isaque<span class="text-brand-accent">.</span>araujo</span>
    </div>
  </div>
</template>
