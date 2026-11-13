<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { perfil, experiencias, projetos, competencias, formacao } from '~/data/perfil'

gsap.registerPlugin(ScrollTrigger)

useSeoMeta({
  title: 'Isaque Araujo — Desenvolvedor Full Stack',
  ogTitle: 'Isaque Araujo — Desenvolvedor Full Stack',
})

const videoRefs = ref<Record<number, HTMLVideoElement>>({})
const playing = ref<Record<number, boolean>>({})
let videoObserver: IntersectionObserver | null = null
let ctx: gsap.Context | null = null

const setVideoRef = (index: number) => (el: any) => {
  if (el) videoRefs.value[index] = el as HTMLVideoElement
}

const togglePlay = (index: number) => {
  const video = videoRefs.value[index]
  if (!video) return
  if (video.paused) {
    video.play().catch(() => {})
    playing.value[index] = true
  } else {
    video.pause()
    playing.value[index] = false
  }
}

const iniciarAnimacoes = () => {
  ctx = gsap.context(() => {
    gsap.timeline()
      .from('.hero-line', { yPercent: 110, duration: 1.1, stagger: 0.09, ease: 'power4.out', delay: 0.15 })
      .from('.hero-fade', { y: 18, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' }, '-=0.6')

    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        y: 36,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
      })
    })

    gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
      gsap.from(group.children, {
        scrollTrigger: { trigger: group, start: 'top 85%', once: true },
        y: 28,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
      })
    })
  })
}

onMounted(() => {
  window.addEventListener('preloader-finished', iniciarAnimacoes, { once: true })

  videoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target as HTMLVideoElement
      if (entry.isIntersecting) return
      video.pause()
      const index = Number(video.dataset.index)
      playing.value[index] = false
    })
  }, { threshold: 0.15 })
  Object.values(videoRefs.value).forEach((v) => videoObserver?.observe(v))
})

onUnmounted(() => {
  window.removeEventListener('preloader-finished', iniciarAnimacoes)
  ctx?.revert()
  videoObserver?.disconnect()
})

const anoAtual = new Date().getFullYear()
</script>

<template>
  <div class="w-full">
    <!-- HERO -->
    <section id="inicio" class="relative min-h-[100dvh] flex items-end overflow-hidden">
      <ClientOnly><HeroScene /></ClientOnly>
      <div class="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-brand-dark to-transparent z-[1] pointer-events-none"></div>

      <div class="relative z-10 max-w-6xl mx-auto w-full px-5 md:px-8 pt-32 pb-20 md:pb-28">
        <div class="hero-fade flex items-center gap-3 mb-8">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-brand-accent"></span>
          </span>
          <span class="text-[11px] font-mono tracking-[0.2em] text-gray-400 uppercase">{{ perfil.disponibilidade }} · {{ perfil.cidade }}</span>
        </div>

        <h1 class="font-display font-bold tracking-[-0.03em] leading-[0.95] text-white text-[clamp(2.6rem,7.5vw,6.5rem)] max-w-5xl">
          <span class="block overflow-hidden"><span class="hero-line block">Desenvolvedor que</span></span>
          <span class="block overflow-hidden"><span class="hero-line block">coloca sistemas</span></span>
          <span class="block overflow-hidden"><span class="hero-line block text-brand-accent">em produção.</span></span>
        </h1>

        <div class="mt-10 grid md:grid-cols-12 gap-8 items-end">
          <p class="hero-fade md:col-span-7 text-base md:text-lg text-gray-400 leading-relaxed max-w-[58ch]">
            Sou <strong class="text-white font-semibold">Isaque Araujo</strong>, estagiário de T.I. na Gaseo e estudante de Ciências da Computação.
            Mantenho sistemas internos em NestJS, Angular e PHP durante o dia e construo produtos próprios à noite.
          </p>
          <div class="hero-fade md:col-span-5 flex flex-wrap md:justify-end gap-3">
            <a href="#projetos" class="btn-primary">ver projetos <span aria-hidden="true">↓</span></a>
            <a href="/curriculo" class="btn-ghost">currículo</a>
          </div>
        </div>

        <dl class="hero-fade mt-14 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div class="bg-brand-dark p-5">
            <dt class="eyebrow">Sistemas</dt>
            <dd class="mt-2 font-display text-2xl text-white">4 em produção</dd>
          </div>
          <div class="bg-brand-dark p-5">
            <dt class="eyebrow">Atualmente</dt>
            <dd class="mt-2 font-display text-2xl text-white">T.I. @ Gaseo</dd>
          </div>
          <div class="bg-brand-dark p-5">
            <dt class="eyebrow">Formação</dt>
            <dd class="mt-2 font-display text-2xl text-white">CC · UNIP</dd>
          </div>
          <div class="bg-brand-dark p-5">
            <dt class="eyebrow">Stack principal</dt>
            <dd class="mt-2 font-display text-2xl text-white">TS · Node · SQL</dd>
          </div>
        </dl>
      </div>
    </section>

    <!-- SOBRE -->
    <section id="sobre" class="py-28 md:py-40 px-5 md:px-8 border-t border-white/[0.06]">
      <div class="max-w-6xl mx-auto grid md:grid-cols-12 gap-10 md:gap-16 items-start">
        <div class="md:col-span-4" data-reveal>
          <span class="eyebrow">Sobre</span>
          <h2 class="mt-3 font-display font-bold tracking-tight text-white text-3xl md:text-4xl leading-tight">Menos vitrine, mais sistema rodando.</h2>
        </div>
        <div class="md:col-span-8 grid sm:grid-cols-[200px_1fr] gap-8 items-start" data-reveal>
          <div class="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/[0.08] max-w-[220px]">
            <img src="/isaque_hero_optimized.jpg" alt="Foto de Isaque Araujo" class="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" width="640" height="1139" loading="lazy" />
          </div>
          <div class="text-gray-400 leading-relaxed space-y-5 text-[15px] md:text-base">
            <p>{{ perfil.resumo }}</p>
            <p>
              Gosto de testar comportamento ao vivo antes de confiar na leitura do código, de escrever a menor solução que funciona e de documentar o que aprendi
              para não resolver o mesmo problema duas vezes. Código, nomes e comentários em português quando o time é brasileiro.
            </p>
            <ul class="grid sm:grid-cols-2 gap-3 pt-2">
              <li v-for="f in formacao" :key="f.curso" class="card p-4">
                <p class="text-white font-semibold text-sm">{{ f.curso }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ f.instituicao }} · {{ f.periodo }}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- EXPERIÊNCIA -->
    <section id="experiencia" class="py-28 md:py-40 px-5 md:px-8 bg-black/40 border-y border-white/[0.06]">
      <div class="max-w-6xl mx-auto">
        <div class="grid md:grid-cols-12 gap-10 md:gap-16">
          <div class="md:col-span-4" data-reveal>
            <span class="eyebrow">Experiência</span>
            <h2 class="mt-3 font-display font-bold tracking-tight text-white text-3xl md:text-4xl leading-tight">O que faço no dia a dia.</h2>
          </div>
          <div class="md:col-span-8 space-y-10">
            <article v-for="exp in experiencias" :key="exp.empresa" class="card p-7 md:p-10" data-reveal>
              <div class="flex flex-wrap items-baseline justify-between gap-3 mb-2">
                <h3 class="font-display font-bold text-white text-2xl tracking-tight">{{ exp.cargo }}</h3>
                <span class="text-[11px] font-mono tracking-widest text-brand-accent uppercase">{{ exp.periodo }}</span>
              </div>
              <p class="text-sm text-gray-500 mb-6">{{ exp.empresa }} · {{ exp.local }}</p>
              <p class="text-gray-300 leading-relaxed mb-6">{{ exp.resumo }}</p>
              <ul class="space-y-3 mb-8">
                <li v-for="p in exp.pontos" :key="p" class="flex gap-3 text-sm text-gray-400 leading-relaxed">
                  <span class="mt-2 h-1 w-1 rounded-full bg-brand-accent shrink-0"></span>
                  <span>{{ p }}</span>
                </li>
              </ul>
              <div class="flex flex-wrap gap-2">
                <span v-for="s in exp.stack" :key="s" class="tag">{{ s }}</span>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <!-- PROJETOS -->
    <section id="projetos" class="py-28 md:py-40 px-5 md:px-8">
      <div class="max-w-6xl mx-auto">
        <div class="max-w-2xl mb-16" data-reveal>
          <span class="eyebrow">Projetos</span>
          <h2 class="mt-3 font-display font-bold tracking-tight text-white text-3xl md:text-5xl leading-tight">Coisas que construí e que estão sendo usadas.</h2>
        </div>

        <div class="space-y-6">
          <article
            v-for="(p, index) in projetos"
            :key="p.slug"
            class="card overflow-hidden grid lg:grid-cols-2"
            data-reveal
          >
            <div class="p-7 md:p-10 flex flex-col">
              <div class="flex items-center justify-between gap-4 mb-5">
                <span class="eyebrow">{{ p.categoria }}</span>
                <span class="text-[10px] font-mono tracking-widest uppercase text-gray-500 border border-white/10 rounded-full px-2.5 py-1">{{ p.status }}</span>
              </div>
              <h3 class="font-display font-bold text-white text-2xl md:text-3xl tracking-tight mb-4">{{ p.titulo }}</h3>
              <p class="text-gray-400 leading-relaxed mb-6">{{ p.descricao }}</p>
              <ul class="space-y-2.5 mb-8">
                <li v-for="d in p.destaques" :key="d" class="flex gap-3 text-sm text-gray-400 leading-relaxed">
                  <span class="mt-2 h-1 w-1 rounded-full bg-brand-accent shrink-0"></span>
                  <span>{{ d }}</span>
                </li>
              </ul>
              <div class="flex flex-wrap gap-2 mb-8">
                <span v-for="s in p.stack" :key="s" class="tag">{{ s }}</span>
              </div>
              <div class="mt-auto">
                <a v-if="p.link" :href="p.link" target="_blank" rel="noopener" class="btn-ghost">abrir projeto <span aria-hidden="true">↗</span></a>
                <span v-else class="text-xs font-mono tracking-widest uppercase text-gray-500">sem link público</span>
              </div>
            </div>

            <div class="relative bg-[#0a0a0a] border-t lg:border-t-0 lg:border-l border-white/[0.06] min-h-[260px] flex items-center justify-center p-6 md:p-10">
              <div v-if="p.video" class="w-full rounded-xl overflow-hidden border border-white/10 bg-black shadow-2xl">
                <div class="flex items-center gap-2 px-3 py-2 bg-[#141414] border-b border-white/5">
                  <span class="w-2.5 h-2.5 rounded-full bg-white/15"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-white/15"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-white/15"></span>
                  <span class="ml-3 flex-1 text-[9px] font-mono text-gray-500 truncate">{{ p.link?.replace('https://', '') }}</span>
                </div>
                <div class="relative aspect-video group/video">
                  <video
                    :ref="setVideoRef(index)"
                    :data-index="index"
                    preload="metadata"
                    loop
                    muted
                    playsinline
                    class="w-full h-full object-cover cursor-pointer"
                    @click="togglePlay(index)"
                  >
                    <source v-if="p.webm" :src="p.webm" type="video/webm" />
                    <source :src="p.video" type="video/mp4" />
                  </video>
                  <button
                    class="absolute inset-0 m-auto w-14 h-14 rounded-full bg-black/70 border border-white/10 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 hover:scale-105"
                    :class="playing[index] ? 'opacity-0 group-hover/video:opacity-100' : 'opacity-100'"
                    :aria-label="playing[index] ? 'Pausar demonstração' : 'Reproduzir demonstração'"
                    @click="togglePlay(index)"
                  >
                    <svg v-if="!playing[index]" class="h-6 w-6 fill-current text-brand-accent ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    <svg v-else class="h-6 w-6 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                  </button>
                </div>
              </div>

              <div v-else class="w-full font-mono text-[11px] text-gray-500 leading-relaxed">
                <div class="flex justify-between border-b border-white/[0.06] pb-2 mb-3 text-gray-600">
                  <span>{{ p.slug }}</span><span>{{ p.status.toUpperCase() }}</span>
                </div>
                <ul class="space-y-1.5">
                  <li v-for="s in p.stack" :key="s" class="flex justify-between gap-4">
                    <span class="text-gray-400">{{ s }}</span><span class="text-brand-accent/70">✓</span>
                  </li>
                </ul>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- COMPETÊNCIAS -->
    <section id="competencias" class="py-28 md:py-40 px-5 md:px-8 bg-black/40 border-y border-white/[0.06]">
      <div class="max-w-6xl mx-auto">
        <div class="max-w-2xl mb-14" data-reveal>
          <span class="eyebrow">Competências</span>
          <h2 class="mt-3 font-display font-bold tracking-tight text-white text-3xl md:text-5xl leading-tight">Ferramentas que uso de verdade.</h2>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" data-reveal-group>
          <div v-for="c in competencias" :key="c.grupo" class="card p-6">
            <h3 class="eyebrow mb-4">{{ c.grupo }}</h3>
            <ul class="flex flex-wrap gap-2">
              <li v-for="i in c.itens" :key="i" class="tag !text-gray-200">{{ i }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- CONTATO -->
    <section id="contato" class="py-28 md:py-40 px-5 md:px-8 relative overflow-hidden">
      <div class="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_100%,rgba(204,255,0,0.12),transparent_55%)]"></div>
      <div class="max-w-6xl mx-auto relative">
        <div class="max-w-3xl" data-reveal>
          <span class="eyebrow">Contato</span>
          <h2 class="mt-3 font-display font-bold tracking-tight text-white text-[clamp(2.2rem,6vw,4.5rem)] leading-[1]">Procurando alguém que entrega? Vamos conversar.</h2>
          <p class="mt-6 text-gray-400 leading-relaxed max-w-[52ch]">
            Aberto a estágio e vagas júnior, presencial na região de Limeira/Campinas ou remoto. Respondo e-mail no mesmo dia.
          </p>
          <div class="mt-10 flex flex-wrap gap-3">
            <a :href="`mailto:${perfil.email}`" class="btn-primary">{{ perfil.email }}</a>
            <a :href="perfil.linkedin" target="_blank" rel="noopener" class="btn-ghost">linkedin ↗</a>
            <a :href="perfil.github" target="_blank" rel="noopener" class="btn-ghost">github ↗</a>
            <a href="/curriculo" class="btn-ghost">currículo</a>
          </div>
        </div>

        <footer class="mt-28 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between gap-3 text-[11px] font-mono tracking-widest text-gray-600 uppercase">
          <span>© {{ anoAtual }} Isaque Araujo</span>
          <span>Nuxt · Three.js · GSAP · Vercel</span>
        </footer>
      </div>
    </section>
  </div>
</template>
