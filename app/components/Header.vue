<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'

const links = [
  { id: 'sobre', label: 'sobre' },
  { id: 'experiencia', label: 'experiência' },
  { id: 'projetos', label: 'projetos' },
  { id: 'competencias', label: 'competências' },
  { id: 'contato', label: 'contato' },
]

const isMenuOpen = ref(false)
const scrolled = ref(false)
const activeSection = ref('')
const menuRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const scrollToSection = (id: string, event: Event) => {
  event.preventDefault()
  const lenis = (window as any).lenis
  const target = document.getElementById(id)
  if (!target) return
  if (lenis) {
    lenis.scrollTo(target, { offset: -72, duration: 1.4, easing: (t: number) => 1 - Math.pow(1 - t, 4) })
  } else {
    target.scrollIntoView({ behavior: 'smooth' })
  }
  if (isMenuOpen.value) toggleMenu()
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  const lenis = (window as any).lenis
  if (isMenuOpen.value) {
    lenis?.stop()
    gsap.to(menuRef.value, { clipPath: 'circle(150% at 100% 0%)', duration: 0.7, ease: 'power3.out' })
    gsap.fromTo('.menu-link', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.07, delay: 0.15, ease: 'power3.out' })
  } else {
    lenis?.start()
    gsap.to(menuRef.value, { clipPath: 'circle(0% at 100% 0%)', duration: 0.5, ease: 'power3.in' })
  }
}

const onScroll = () => { scrolled.value = window.scrollY > 24 }

onMounted(() => {
  gsap.from('.site-header', { y: -24, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.1 })
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) activeSection.value = entry.target.id })
  }, { rootMargin: '-40% 0px -55% 0px' })
  ;['inicio', ...links.map((l) => l.id)].forEach((id) => {
    const el = document.getElementById(id)
    if (el) observer?.observe(el)
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  observer?.disconnect()
})
</script>

<template>
  <div class="no-print">
    <header
      class="site-header fixed top-0 left-0 w-full z-40 transition-all duration-500"
      :class="scrolled ? 'bg-brand-dark/80 backdrop-blur-xl border-b border-white/[0.06]' : 'bg-transparent border-b border-transparent'"
    >
      <div class="max-w-6xl mx-auto px-5 md:px-8 h-16 md:h-[72px] flex items-center justify-between">
        <a href="#inicio" @click="scrollToSection('inicio', $event)" class="font-display font-bold tracking-tight text-base text-white hover:text-brand-accent transition-colors">
          isaque<span class="text-brand-accent">.</span>araujo
        </a>

        <nav class="hidden md:flex items-center gap-1" aria-label="Seções">
          <a
            v-for="l in links"
            :key="l.id"
            :href="`#${l.id}`"
            @click="scrollToSection(l.id, $event)"
            class="px-3 py-1.5 text-[11px] font-mono tracking-[0.15em] uppercase rounded-full transition-colors duration-300"
            :class="activeSection === l.id ? 'text-brand-accent bg-white/5' : 'text-gray-400 hover:text-white'"
          >
            {{ l.label }}
          </a>
        </nav>

        <div class="hidden md:flex items-center gap-3">
          <a href="/curriculo" class="text-[11px] font-mono tracking-[0.15em] uppercase text-gray-400 hover:text-white transition-colors">currículo</a>
          <a href="#contato" @click="scrollToSection('contato', $event)" class="btn-primary !px-4 !py-2 !text-[10px]">fale comigo</a>
        </div>

        <button
          @click="toggleMenu"
          class="md:hidden flex flex-col justify-center items-center gap-1.5 w-10 h-10 rounded-full bg-white/5 border border-white/10 relative z-50"
          :aria-expanded="isMenuOpen"
          aria-label="Abrir menu"
        >
          <span class="w-5 h-[1.5px] bg-white transition-transform duration-300" :class="{ 'rotate-45 translate-y-[5px]': isMenuOpen }"></span>
          <span class="w-5 h-[1.5px] bg-white transition-opacity duration-300" :class="{ 'opacity-0': isMenuOpen }"></span>
          <span class="w-5 h-[1.5px] bg-white transition-transform duration-300" :class="{ '-rotate-45 -translate-y-[5px]': isMenuOpen }"></span>
        </button>
      </div>
    </header>

    <div
      ref="menuRef"
      class="fixed inset-0 z-40 bg-brand-dark/95 backdrop-blur-2xl flex flex-col justify-center items-center md:hidden"
      style="clip-path: circle(0% at 100% 0%)"
    >
      <nav class="flex flex-col items-center gap-7 text-center" aria-label="Seções (mobile)">
        <a
          v-for="l in links"
          :key="l.id"
          :href="`#${l.id}`"
          @click="scrollToSection(l.id, $event)"
          class="menu-link text-3xl font-display font-semibold tracking-tight uppercase transition-colors"
          :class="activeSection === l.id ? 'text-brand-accent' : 'text-white'"
        >
          {{ l.label }}
        </a>
        <a href="/curriculo" class="menu-link mt-4 btn-ghost">ver currículo</a>
      </nav>
    </div>
  </div>
</template>
