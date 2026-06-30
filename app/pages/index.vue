<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    title: 'NEXUS LIFE OS',
    description: 'Sistema operacional pessoal com assistente de IA integrado (Nexus Atlas AI), automação financeira (Safe to Spend) e rotina gamificada.',
    stack: ['Next.js 16', 'React 19', 'PostgreSQL', 'Drizzle ORM', 'Clerk', 'Tailwind CSS v4'],
    link: 'https://nexus-life-os-web.vercel.app/pt-BR',
    role: 'Criador & Desenvolvedor Principal',
    video: 'https://ydl44u2e7tjee9xl.public.blob.vercel-storage.com/nexus_life_os_demo.mp4',
    webm: 'https://ydl44u2e7tjee9xl.public.blob.vercel-storage.com/nexus_life_os_demo.webm'
  },
  {
    title: 'CASA DE KISAVITA',
    description: 'Sistema de delivery Single Page Application com painel administrativo, gestão de cardápio em tempo real e pedidos diretos no WhatsApp.',
    stack: ['JavaScript (ES6+)', 'HTML5', 'CSS3', 'Firebase Firestore'],
    link: 'https://restaurante-kisavita.vercel.app',
    role: 'Desenvolvedor Full Stack',
    video: 'https://ydl44u2e7tjee9xl.public.blob.vercel-storage.com/kisavita_demo.mp4',
    webm: 'https://ydl44u2e7tjee9xl.public.blob.vercel-storage.com/kisavita_demo.webm'
  }
]

const skills = [
  { name: 'NUXT 3 / VUE 3', category: 'frontend' },
  { name: 'NEXT.JS / REACT', category: 'frontend' },
  { name: 'TYPESCRIPT', category: 'frontend' },
  { name: 'TAILWIND CSS V4', category: 'styling' },
  { name: 'GSAP / LENIS', category: 'animation' },
  { name: 'PHP / DOCKER', category: 'backend' },
  { name: 'POSTGRESQL / MYSQL', category: 'database' },
  { name: 'FIREBASE / NOSQL', category: 'database' },
  { name: 'AI INTEGRATION / MCP', category: 'ai' },
  { name: 'GITFLOW / DEVOPS', category: 'tools' }
]

const photoContainer = ref<HTMLElement | null>(null)
const mouseX = ref(0)
const mouseY = ref(0)
const isHoveringPhoto = ref(false)

const videoRefs = ref<HTMLVideoElement[]>([])
const playingStates = ref<Record<number, boolean>>({})
let videoObserver: IntersectionObserver | null = null

const togglePlay = (index: number) => {
  const video = videoRefs.value[index]
  if (!video) return
  if (video.paused) {
    video.play().catch(() => {})
    playingStates.value[index] = true
  } else {
    video.pause()
    playingStates.value[index] = false
  }
}

const handleMouseMove = (e: MouseEvent) => {
  if (!photoContainer.value) return
  const rect = photoContainer.value.getBoundingClientRect()
  mouseX.value = e.clientX - rect.left
  mouseY.value = e.clientY - rect.top
}

const handleMouseEnter = () => {
  isHoveringPhoto.value = true
}

const handleMouseLeave = () => {
  isHoveringPhoto.value = false
}

// Mobile Touch Support for Hero Photo mask reveal
const handleTouchMove = (e: TouchEvent) => {
  if (!photoContainer.value) return
  // Prevent default scroll behavior when dragging on the image
  e.preventDefault()
  const touch = e.touches[0]
  const rect = photoContainer.value.getBoundingClientRect()
  mouseX.value = touch.clientX - rect.left
  mouseY.value = touch.clientY - rect.top
}

const handleTouchStart = (e: TouchEvent) => {
  isHoveringPhoto.value = true
  handleTouchMove(e)
}

const handleTouchEnd = () => {
  isHoveringPhoto.value = false
}

const maskStyle = computed(() => {
  if (!isHoveringPhoto.value) {
    return {
      '-webkit-mask-image': 'radial-gradient(circle 0px at 50% 50%, black 100%, transparent 100%)',
      'mask-image': 'radial-gradient(circle 0px at 50% 50%, black 100%, transparent 100%)'
    }
  }
  return {
    '-webkit-mask-image': `radial-gradient(circle 120px at ${mouseX.value}px ${mouseY.value}px, black 0%, transparent 100%)`,
    'mask-image': `radial-gradient(circle 120px at ${mouseX.value}px ${mouseY.value}px, black 0%, transparent 100%)`
  }
})

let clockInterval: any = null

onMounted(() => {
  // Hero entrance animation
  const tl = gsap.timeline()
  tl.from('.hero-title-word', {
    yPercent: 100,
    duration: 1.2,
    stagger: 0.1,
    ease: 'power4.out',
    delay: 0.5
  })
  .from('.hero-sub', {
    y: 20,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
  }, '-=0.6')
  .from('.hero-cta-btn', {
    y: 20,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out'
  }, '-=0.4')
  .from('.hero-photo', {
    y: 35,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out'
  }, '-=1.0')

  // Scroll animations for Bento grid
  gsap.from('.bento-card', {
    scrollTrigger: {
      trigger: '.bento-section',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.15,
    ease: 'power3.out'
  })

  // Projects scroll scale animation
  const projectCards = gsap.utils.toArray<HTMLElement>('.project-card')
  projectCards.forEach((card) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      scale: 0.95,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })
  })

  // Skills reveal
  gsap.from('.skill-pill', {
    scrollTrigger: {
      trigger: '.skills-section',
      start: 'top 80%'
    },
    y: 20,
    opacity: 0,
    stagger: 0.05,
    duration: 0.6,
    ease: 'power3.out'
  })

  // Dynamic clock for console widget
  const updateClock = () => {
    const timeEl = document.getElementById('live-time')
    if (timeEl) {
      const now = new Date()
      timeEl.innerText = now.toLocaleTimeString('pt-BR', { hour12: false })
    }
  }
  clockInterval = setInterval(updateClock, 1000)
  updateClock()

  // Intersection Observer to pause off-screen videos
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
    videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target as HTMLVideoElement
        if (!entry.isIntersecting) {
          video.pause()
          const index = videoRefs.value.indexOf(video)
          if (index !== -1) {
            playingStates.value[index] = false
          }
        }
      })
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    })

    videoRefs.value.forEach((video) => {
      if (video) videoObserver?.observe(video)
    })
  }
})

onUnmounted(() => {
  if (clockInterval) {
    clearInterval(clockInterval)
  }
  if (videoObserver) {
    videoObserver.disconnect()
  }
})
</script>

<template>
  <div class="w-full">
    <!-- Hero Section -->
    <section id="hero" class="relative min-h-[100dvh] flex flex-col justify-center items-center px-4 md:px-8 pt-32 pb-24 overflow-hidden">
      <!-- Background Orb Grid -->
      <div class="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[280px] md:w-[500px] h-[280px] md:h-[500px] bg-brand-accent rounded-full filter blur-[80px] md:blur-[180px]"></div>
        <div class="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[240px] md:w-[400px] h-[240px] md:h-[400px] bg-blue-950 rounded-full filter blur-[80px] md:blur-[180px]"></div>
      </div>

      <div class="max-w-4xl mx-auto w-full flex flex-col items-center z-10 relative text-center">
        <!-- Main Headline -->
        <h1 class="hero-title text-[clamp(2.5rem,6vw,5.5rem)] font-display font-extrabold tracking-tighter leading-none text-white max-w-5xl overflow-hidden mb-6">
          <span class="inline-block hero-title-word">CONSTRUINDO </span>
          <span class="inline-block hero-title-word text-brand-accent">&nbsp;SISTEMAS&nbsp;</span>
          <span class="inline-block hero-title-word">INTELIGENTES </span>
          <br />
          <span class="inline-block hero-title-word">E AUTOMATIZANDO </span>
          <span class="inline-block hero-title-word text-gray-500">&nbsp;PROCESSOS.</span>
        </h1>

        <!-- Subtext -->
        <p class="hero-sub text-base text-gray-400 max-w-[55ch] leading-relaxed mb-8 tracking-tight mx-auto">
          Estudante de Ciências da Computação e Estagiário de T.I. focado em desenvolvimento de software, integrações de IA e automações.
        </p>

        <!-- Centered Lando-Style Fade Cutout (No border, transparent bottom fade) -->
        <div class="hero-photo w-full flex justify-center mb-10">
          <div 
            ref="photoContainer"
            class="relative w-full max-w-[320px] aspect-[3/4.2] group overflow-hidden cursor-crosshair rounded-2xl border border-white/5 shadow-2xl select-none"
            style="-webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%); mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%); touch-action: none;"
            @mousemove="handleMouseMove"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave"
            @touchmove="handleTouchMove"
            @touchstart="handleTouchStart"
            @touchend="handleTouchEnd"
          >
            <!-- Background Image: Grayscale -->
            <img 
              src="/isaque_hero_optimized.jpg" 
              alt="Isaque Araujo" 
              class="absolute inset-0 w-full h-full object-cover filter grayscale contrast-125 transition-all duration-700 ease-out"
            />
            <!-- Foreground Image: Colored, revealed by cursor mask -->
            <img 
              src="/isaque_hero_optimized.jpg" 
              alt="Isaque Araujo" 
              class="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-300"
              :class="isHoveringPhoto ? 'opacity-100' : 'opacity-0'"
              :style="maskStyle"
            />
            <!-- Custom info overlay -->
            <div class="absolute bottom-12 left-6 z-10 text-left pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-500">
              <span class="text-[9px] font-mono tracking-widest text-brand-accent uppercase">isaque araujo</span>
              <p class="text-[10px] font-mono text-white tracking-tight mt-0.5">EST. 2026 // LIMEIRA.BR</p>
            </div>
          </div>
        </div>

        <!-- Live Developer Console Widget -->
        <div class="hero-sub w-full max-w-sm mb-8 double-bezel-outer text-left">
          <div class="double-bezel-inner p-4 font-mono text-[10px] text-gray-400 flex flex-col gap-2">
            <div class="flex justify-between border-b border-white/5 pb-2 text-gray-500">
              <span>DEV_CONSOLE // ATIVO</span>
              <span class="flex items-center gap-1.5">
                <span class="h-1.5 w-1.5 rounded-full bg-brand-accent animate-pulse"></span>
                LIVE_SYNC
              </span>
            </div>
            <div class="flex justify-between mt-1">
              <span>FOCO_ATUAL:</span>
              <span class="text-white">NUXT 3 / INTEGRAÇÕES DE IA</span>
            </div>
            <div class="flex justify-between">
              <span>STATUS:</span>
              <span class="text-brand-accent">BUSCANDO_ESTAGIO</span>
            </div>
            <div class="flex justify-between">
              <span>HORA_LOCAL:</span>
              <span class="text-white" id="live-time">00:00:00</span>
            </div>
            <div class="flex justify-between">
              <span>CONTAINERS:</span>
              <span class="text-white">4/4 RODANDO</span>
            </div>
          </div>
        </div>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <!-- Primary CTA with Button-in-Button Trailing Icon -->
          <a
            href="#projects"
            class="hero-cta-btn group relative flex items-center gap-3 pl-6 pr-2 py-2 rounded-full bg-white text-black text-xs font-mono tracking-widest uppercase hover:bg-brand-accent hover:text-white transition-premium"
          >
            ver projetos
            <span class="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-[1px]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </a>

          <!-- Secondary CTA -->
          <a
            href="#contact"
            class="hero-cta-btn px-6 py-3.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-mono tracking-widest uppercase transition-premium"
          >
            entrar em contato
          </a>
        </div>
      </div>
    </section>

    <!-- About Section (Bento Grid) -->
    <section id="about" class="bento-section py-32 md:py-48 px-4 md:px-8 bg-black/40 border-y border-white/5 relative">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl md:text-5xl font-display font-extrabold tracking-tighter text-white mb-16 text-center uppercase">
          perfil & trajetória
        </h2>

        <!-- Gapless Bento Grid -->
        <div class="grid grid-cols-1 md:grid-cols-12 grid-flow-dense gap-6">
          <!-- Card 1: Experience (6 Cols) -->
          <div class="bento-card col-span-1 md:col-span-6 double-bezel-outer h-[350px]">
            <div class="double-bezel-inner h-full p-8 flex flex-col justify-between">
              <div>
                <span class="text-[10px] font-mono tracking-widest text-brand-accent uppercase">cargo atual</span>
                <h3 class="text-2xl font-display font-bold text-white tracking-tight mt-2 uppercase">Estagiário de T.I. na Gaseo</h3>
              </div>
              <p class="text-sm text-gray-400 leading-relaxed font-sans">
                Desenvolvimento de dashboards internos em PHP para transformar métricas operacionais em dados acionáveis. Aplicação de Docker e versionamento Gitflow em ambientes de desenvolvimento.
              </p>
              <div class="text-[11px] font-mono text-gray-500 uppercase tracking-widest">
                desde abril de 2026
              </div>
            </div>
          </div>

          <!-- Card 2: Featured Architecture / System Blueprint (6 Cols) -->
          <div class="bento-card col-span-1 md:col-span-6 double-bezel-outer h-[350px]">
            <div class="double-bezel-inner h-full p-8 flex flex-col justify-between">
              <div>
                <span class="text-[10px] font-mono tracking-widest text-brand-accent uppercase">projeto em destaque</span>
                <h3 class="text-2xl font-display font-bold text-white tracking-tight mt-2 uppercase">Nexus Life OS</h3>
              </div>
              <div class="flex flex-col gap-2 font-mono text-[10px] text-gray-500 my-2">
                <div class="flex justify-between border-b border-white/5 pb-1">
                  <span>MÓDULOS // ATIVOS</span>
                  <span class="text-brand-accent">ONLINE</span>
                </div>
                <div class="flex items-center justify-between text-gray-300">
                  <span>• ATLAS_AI_ASSISTANT</span>
                  <span class="text-gray-500">GEMINI_1.5</span>
                </div>
                <div class="flex items-center justify-between text-gray-300">
                  <span>• SAFE_TO_SPEND</span>
                  <span class="text-gray-500">MÓDULO_FINANÇAS</span>
                </div>
                <div class="flex items-center justify-between text-gray-300">
                  <span>• XP_STREAK_GAMER</span>
                  <span class="text-gray-500">MÓDULO_ROTINA</span>
                </div>
              </div>
              <p class="text-xs text-gray-400 leading-relaxed font-sans">
                Um sistema operacional pessoal integrado com banco de dados PostgreSQL serverless (Neon), Drizzle ORM e suporte a multi-idiomas.
              </p>
            </div>
          </div>

          <!-- Card 3: Education (8 Cols) -->
          <div class="bento-card col-span-1 md:col-span-8 double-bezel-outer h-[300px]">
            <div class="double-bezel-inner h-full p-8 flex flex-col justify-between">
              <div>
                <span class="text-[10px] font-mono tracking-widest text-brand-accent uppercase">formação acadêmica</span>
                <h3 class="text-2xl font-display font-bold text-white tracking-tight mt-2 uppercase">ciências da computação / unip</h3>
              </div>
              <p class="text-sm text-gray-400 leading-relaxed font-sans">
                Cursando Bacharelado em Ciências da Computação, construindo bases sólidas em algoritmos, arquitetura de software e integrações de inteligência artificial.
              </p>
              <div class="text-[11px] font-mono text-gray-500 uppercase tracking-widest">
                limeira, sp, brasil
              </div>
            </div>
          </div>

          <!-- Card 4: Philosophy (4 Cols) -->
          <div class="bento-card col-span-1 md:col-span-4 double-bezel-outer h-[300px]">
            <div class="double-bezel-inner h-full p-8 flex flex-col justify-between">
              <div>
                <span class="text-[10px] font-mono tracking-widest text-brand-accent uppercase">foco & filosofia</span>
                <h3 class="text-xl font-display font-bold text-white tracking-tight mt-2 uppercase">autodidatismo</h3>
              </div>
              <p class="text-xs text-gray-400 leading-relaxed font-sans">
                Aprendizado contínuo e desenvolvimento de aplicações em produção. Foco em APIs web de alta performance e automações inteligentes.
              </p>
              <div class="text-[11px] font-mono text-brand-accent uppercase tracking-widest">
                movido por código
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Projects Section -->
    <section id="projects" class="py-32 md:py-48 px-4 md:px-8 relative">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl md:text-5xl font-display font-extrabold tracking-tighter text-white mb-16 text-center uppercase">
          projetos selecionados
        </h2>

        <!-- Projects List (Double Bezel Stack) -->
        <div class="flex flex-col gap-12">
          <div 
            v-for="(project, index) in projects" 
            :key="index"
            class="project-card double-bezel-outer overflow-hidden"
          >
            <div class="double-bezel-inner p-8 md:p-12 flex flex-col lg:flex-row justify-between gap-12 items-center">
              <!-- Left: Description -->
              <div class="flex-1 w-full lg:w-1/2 flex flex-col items-start text-left">
                <span class="text-[10px] font-mono tracking-widest text-brand-accent uppercase">{{ project.role }}</span>
                <h3 class="text-2xl md:text-3xl font-display font-bold text-white tracking-tight mt-2 mb-4">{{ project.title }}</h3>
                <p class="text-sm md:text-base text-gray-400 leading-relaxed font-sans mb-6">
                  {{ project.description }}
                </p>
                <div class="flex flex-wrap gap-2 mb-8">
                  <span 
                    v-for="(tech, tIndex) in project.stack" 
                    :key="tIndex"
                    class="text-[10px] font-mono tracking-wider px-3 py-1 rounded-full bg-white/5 border border-white/5 text-gray-300"
                  >
                    {{ tech }}
                  </span>
                </div>
                <a 
                  :href="project.link" 
                  target="_blank" 
                  class="group flex items-center justify-center gap-3 px-6 py-3.5 rounded-full bg-white/5 border border-white/10 hover:bg-white text-white hover:text-black text-xs font-mono tracking-widest uppercase transition-premium"
                >
                  visitar projeto
                  <span class="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-[1px]">↗</span>
                </a>
              </div>
              
              <!-- Right: Browser Mockup -->
              <div class="w-full lg:w-1/2 flex justify-center">
                <div class="w-full max-w-[480px] bg-[#121212] border border-white/10 rounded-xl overflow-hidden shadow-2xl group/browser">
                  <!-- Browser Header / Window Controls -->
                  <div class="flex items-center justify-between px-4 py-3 bg-[#181818] border-b border-white/5">
                    <div class="flex gap-1.5">
                      <span class="w-2.5 h-2.5 rounded-full bg-red-500/60"></span>
                      <span class="w-2.5 h-2.5 rounded-full bg-yellow-500/60"></span>
                      <span class="w-2.5 h-2.5 rounded-full bg-green-500/60"></span>
                    </div>
                    <!-- Address Bar Mockup -->
                    <div class="flex-1 mx-4 bg-black/40 border border-white/5 rounded-md py-1 px-3 text-[9px] font-mono text-gray-500 text-center select-none overflow-hidden text-ellipsis whitespace-nowrap">
                      {{ project.link.replace('https://', '') }}
                    </div>
                    <div class="w-8"></div>
                  </div>
                  <!-- Content Body -->
                  <div class="relative w-full aspect-video overflow-hidden bg-black flex items-center justify-center group/video">
                    <!-- Video (Plays on all screens) -->
                    <video 
                      v-if="project.video || project.webm"
                      :ref="el => { if (el) videoRefs[index] = el as HTMLVideoElement }"
                      preload="auto"
                      loop
                      muted
                      playsinline
                      class="w-full h-full object-cover cursor-pointer"
                      @click="togglePlay(index)"
                    >
                      <source v-if="project.webm" :src="project.webm" type="video/webm" />
                      <source v-if="project.video" :src="project.video" type="video/mp4" />
                    </video>
                    <!-- Static Image Mockup (Fallback if video is not defined) -->
                    <img 
                      v-else-if="project.image"
                      :src="project.image"
                      alt="Project Preview"
                      class="w-full h-full object-cover"
                      loading="lazy"
                    />

                    <!-- Custom Play/Pause Overlay Button -->
                    <div 
                      v-if="project.video || project.webm"
                      class="absolute inset-0 flex items-center justify-center bg-black/25 cursor-pointer transition-colors duration-300 pointer-events-none"
                      :class="playingStates[index] ? 'bg-transparent' : 'bg-black/40'"
                    >
                      <button 
                        class="w-14 h-14 rounded-full bg-black/70 border border-white/10 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 shadow-2xl pointer-events-auto hover:scale-105 active:scale-95"
                        :class="playingStates[index] ? 'opacity-0 scale-75 lg:group-hover/video:opacity-100 lg:group-hover/video:scale-100' : 'opacity-100 scale-100'"
                        @click="togglePlay(index)"
                      >
                        <!-- Play Icon (when paused) -->
                        <svg v-if="!playingStates[index]" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 fill-current text-brand-accent ml-0.5" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        <!-- Pause Icon (shown on hover when playing) -->
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 fill-current text-white" viewBox="0 0 24 24">
                          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Skills Section -->
    <section id="skills" class="skills-section py-32 md:py-48 px-4 md:px-8 bg-black/40 border-t border-white/5 relative">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl md:text-5xl font-display font-extrabold tracking-tighter text-white mb-16 text-center uppercase">
          tecnologias & competências
        </h2>

        <div class="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          <div 
            v-for="(skill, index) in skills" 
            :key="index"
            class="skill-pill double-bezel-outer cursor-default"
          >
            <div class="double-bezel-inner px-6 py-3 text-xs font-mono tracking-widest text-white uppercase hover:text-brand-accent transition-colors duration-300">
              {{ skill.name }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact & Footer Section -->
    <section id="contact" class="py-32 md:py-48 px-4 md:px-8 relative text-center">
      <div class="absolute inset-0 z-0 pointer-events-none opacity-10">
        <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] md:w-[600px] h-[150px] md:h-[300px] bg-brand-accent rounded-full filter blur-[80px] md:blur-[150px]"></div>
      </div>

      <div class="max-w-4xl mx-auto z-10 relative">
        <h2 class="text-[clamp(2.5rem,5vw,4.5rem)] font-display font-extrabold tracking-tighter text-white mb-8 leading-none uppercase">
          vamos criar <br />algo novo
        </h2>
        <p class="text-base text-gray-400 max-w-[50ch] mx-auto leading-relaxed mb-12">
          Interessado em trabalharmos juntos ou em me contratar para um estágio? Sinta-se à vontade para entrar em contato via e-mail ou redes sociais.
        </p>

        <div class="flex flex-col sm:flex-row justify-center items-center gap-6 mb-20">
          <a 
            href="mailto:isaquediass33@gmail.com" 
            class="group w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white text-black text-xs font-mono tracking-widest uppercase hover:bg-brand-accent hover:text-white transition-premium"
          >
            enviar e-mail
            <span>↗</span>
          </a>
          <a 
            href="https://linkedin.com/in/isaque-araujo0" 
            target="_blank"
            class="w-full sm:w-auto px-8 py-4 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-mono tracking-widest uppercase transition-premium"
          >
            linkedin
          </a>
          <a 
            href="https://github.com/isaquewho" 
            target="_blank"
            class="w-full sm:w-auto px-8 py-4 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-mono tracking-widest uppercase transition-premium"
          >
            github
          </a>
        </div>

        <div class="w-full h-[1px] bg-white/5 mb-8"></div>
        <p class="text-[10px] font-mono tracking-widest text-gray-600 uppercase">
          &copy; 2026 isaque araujo / all rights reserved.
        </p>
      </div>
    </section>
  </div>
</template>
