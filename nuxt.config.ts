// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],
  modules: ['@nuxtjs/tailwindcss'],
  app: {
    head: {
      htmlAttrs: { lang: 'pt-BR' },
      title: 'Isaque Araujo — Desenvolvedor Full Stack',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Portfólio de Isaque Araujo: desenvolvedor full stack e estagiário de T.I. na Gaseo. Sistemas em produção com NestJS, Angular, Next.js, PHP e PostgreSQL.',
        },
        { name: 'theme-color', content: '#050505' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Isaque Araujo — Desenvolvedor Full Stack' },
        {
          property: 'og:description',
          content: 'Sistemas em produção com NestJS, Angular, Next.js, PHP e PostgreSQL. Estagiário de T.I. na Gaseo e estudante de Ciências da Computação.',
        },
        { property: 'og:url', content: 'https://isaque-araujo.vercel.app' },
        { property: 'og:image', content: 'https://isaque-araujo.vercel.app/og.jpg' },
        { property: 'og:locale', content: 'pt_BR' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'canonical', href: 'https://isaque-araujo.vercel.app' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap',
        },
      ],
    },
  },
  vite: {
    optimizeDeps: {
      include: ['gsap', 'gsap/ScrollTrigger', 'lenis', 'three'],
    },
  },
})
