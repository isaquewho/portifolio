<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'

const isMenuOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)
const linksRef = ref<HTMLElement[]>([])

const setLinkRef = (el: any) => {
  if (el) {
    linksRef.value.push(el as HTMLElement)
  }
}

// Scramble Text Hover Effect
const scrambleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*'
const handleLinkHover = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement
  const originalText = target.getAttribute('data-text') || target.innerText
  if (!target.getAttribute('data-text')) {
    target.setAttribute('data-text', originalText)
  }

  let iterations = 0
  const interval = setInterval(() => {
    target.innerText = originalText
      .split('')
      .map((char, index) => {
        if (char === ' ') return ' '
        if (index < iterations) {
          return originalText[index]
        }
        return scrambleCharacters[Math.floor(Math.random() * scrambleCharacters.length)]
      })
      .join('')

    if (iterations >= originalText.length) {
      clearInterval(interval)
      target.innerText = originalText
    }
    iterations += 1/3
  }, 25)
}

const activeSection = ref('hero')

const scrollToSection = (selector: string, event: Event) => {
  event.preventDefault()
  if (typeof window !== 'undefined' && (window as any).lenis) {
    (window as any).lenis.scrollTo(selector, {
      duration: 1.5,
      easing: (t: number) => 1 - Math.pow(1 - t, 4), // easeOutQuart
    })
  } else {
    const target = document.querySelector(selector)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  
  if (isMenuOpen.value) {
    // Clear array on reopen to avoid duplicates
    linksRef.value = []
    
    // Open menu animation
    gsap.to(menuRef.value, {
      clipPath: 'circle(150% at 100% 0%)',
      duration: 0.8,
      ease: 'power3.out'
    })
    
    // Staggered reveal of navigation items
    setTimeout(() => {
      if (linksRef.value.length > 0) {
        gsap.fromTo(linksRef.value, 
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
        )
      }
    }, 100)
  } else {
    // Close menu animation
    gsap.to(menuRef.value, {
      clipPath: 'circle(0% at 100% 0%)',
      duration: 0.6,
      ease: 'power3.in'
    })
  }
}

onMounted(() => {
  // Entrance animation for header pill
  gsap.from('.header-pill', {
    y: -50,
    opacity: 0,
    duration: 1.2,
    ease: 'power4.out',
    delay: 0.2
  })

  // Track active section on scroll
  const sections = ['hero', 'about', 'projects', 'skills', 'contact']
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activeSection.value = entry.target.id
      }
    })
  }, observerOptions)

  sections.forEach((id) => {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  })
})
</script>

<template>
  <div>
    <!-- Desktop & Floating Navigation Pill -->
    <header class="fixed top-0 left-0 w-full z-40 px-4 md:px-8 pointer-events-none">
      <div class="max-w-7xl mx-auto flex justify-between items-center py-6">
        <!-- Logo/Name -->
        <NuxtLink 
          to="/" 
          class="font-display font-bold tracking-tighter text-lg text-white pointer-events-auto hover:text-brand-accent transition-colors duration-300"
        >
          ISAQUE.WHO
        </NuxtLink>

        <!-- Floating Glass Pill for Desktop -->
        <nav class="header-pill hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-white/10 backdrop-blur-md pointer-events-auto shadow-lg">
          <a 
            href="#hero" 
            @click="scrollToSection('#hero', $event)" 
            @mouseenter="handleLinkHover" 
            class="px-3 py-1.5 text-xs font-mono tracking-widest transition-colors duration-300 uppercase rounded-full"
            :class="activeSection === 'hero' ? 'text-brand-accent bg-white/5 border border-white/5 shadow-inner' : 'text-gray-400 hover:text-white'"
          >
            início
          </a>
          <a 
            href="#about" 
            @click="scrollToSection('#about', $event)" 
            @mouseenter="handleLinkHover" 
            class="px-3 py-1.5 text-xs font-mono tracking-widest transition-colors duration-300 uppercase rounded-full"
            :class="activeSection === 'about' ? 'text-brand-accent bg-white/5 border border-white/5 shadow-inner' : 'text-gray-400 hover:text-white'"
          >
            sobre
          </a>
          <a 
            href="#projects" 
            @click="scrollToSection('#projects', $event)" 
            @mouseenter="handleLinkHover" 
            class="px-3 py-1.5 text-xs font-mono tracking-widest transition-colors duration-300 uppercase rounded-full"
            :class="activeSection === 'projects' ? 'text-brand-accent bg-white/5 border border-white/5 shadow-inner' : 'text-gray-400 hover:text-white'"
          >
            projetos
          </a>
          <a 
            href="#skills" 
            @click="scrollToSection('#skills', $event)" 
            @mouseenter="handleLinkHover" 
            class="px-3 py-1.5 text-xs font-mono tracking-widest transition-colors duration-300 uppercase rounded-full"
            :class="activeSection === 'skills' ? 'text-brand-accent bg-white/5 border border-white/5 shadow-inner' : 'text-gray-400 hover:text-white'"
          >
            competências
          </a>
          <a 
            href="#contact" 
            @click="scrollToSection('#contact', $event)" 
            @mouseenter="handleLinkHover" 
            class="px-3 py-1.5 text-xs font-mono tracking-widest transition-colors duration-300 uppercase rounded-full"
            :class="activeSection === 'contact' ? 'text-brand-accent bg-white/5 border border-white/5 shadow-inner' : 'text-gray-400 hover:text-white'"
          >
            contato
          </a>
        </nav>

        <!-- Action / Status Indicator -->
        <div class="hidden md:flex items-center gap-2 pointer-events-auto">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-brand-accent"></span>
          </span>
          <span class="text-[10px] font-mono tracking-widest text-gray-400 uppercase">disponível para oportunidades</span>
        </div>

        <!-- Mobile Menu Trigger -->
        <button 
          @click="toggleMenu"
          class="md:hidden flex flex-col justify-center items-center gap-1.5 w-10 h-10 rounded-full bg-black/40 border border-white/10 backdrop-blur-md pointer-events-auto relative z-50 transition-transform duration-300 active:scale-90"
          aria-label="Toggle Menu"
        >
          <span 
            class="w-5 h-[1.5px] bg-white transition-transform duration-300"
            :class="{ 'rotate-45 translate-y-[5px]': isMenuOpen }"
          ></span>
          <span 
            class="w-5 h-[1.5px] bg-white transition-opacity duration-300"
            :class="{ 'opacity-0': isMenuOpen }"
          ></span>
          <span 
            class="w-5 h-[1.5px] bg-white transition-transform duration-300"
            :class="{ '-rotate-45 -translate-y-[5px]': isMenuOpen }"
          ></span>
        </button>
      </div>
    </header>

    <!-- Mobile Fullscreen Menu Overlay -->
    <div 
      ref="menuRef"
      class="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl flex flex-col justify-center items-center md:hidden"
      style="clip-path: circle(0% at 100% 0%)"
    >
      <div class="flex flex-col items-center gap-8 text-center">
        <a 
          :ref="setLinkRef"
          href="#hero" 
          @click="scrollToSection('#hero', $event); toggleMenu()"
          class="text-4xl font-display font-medium tracking-tight hover:text-brand-accent transition-colors duration-300 uppercase"
          :class="activeSection === 'hero' ? 'text-brand-accent font-bold' : 'text-white'"
        >
          início
        </a>
        <a 
          :ref="setLinkRef"
          href="#about" 
          @click="scrollToSection('#about', $event); toggleMenu()"
          class="text-4xl font-display font-medium tracking-tight hover:text-brand-accent transition-colors duration-300 uppercase"
          :class="activeSection === 'about' ? 'text-brand-accent font-bold' : 'text-white'"
        >
          sobre
        </a>
        <a 
          :ref="setLinkRef"
          href="#projects" 
          @click="scrollToSection('#projects', $event); toggleMenu()"
          class="text-4xl font-display font-medium tracking-tight hover:text-brand-accent transition-colors duration-300 uppercase"
          :class="activeSection === 'projects' ? 'text-brand-accent font-bold' : 'text-white'"
        >
          projetos
        </a>
        <a 
          :ref="setLinkRef"
          href="#skills" 
          @click="scrollToSection('#skills', $event); toggleMenu()"
          class="text-4xl font-display font-medium tracking-tight hover:text-brand-accent transition-colors duration-300 uppercase"
          :class="activeSection === 'skills' ? 'text-brand-accent font-bold' : 'text-white'"
        >
          competências
        </a>
        <a 
          :ref="setLinkRef"
          href="#contact" 
          @click="scrollToSection('#contact', $event); toggleMenu()"
          class="text-4xl font-display font-medium tracking-tight hover:text-brand-accent transition-colors duration-300 uppercase"
          :class="activeSection === 'contact' ? 'text-brand-accent font-bold' : 'text-white'"
        >
          contato
        </a>
      </div>
    </div>
  </div>
</template>
