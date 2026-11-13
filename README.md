# Portfólio — Isaque Araujo

Site pessoal em [isaque-araujo.vercel.app](https://isaque-araujo.vercel.app): projetos, experiência e currículo.

**Stack:** Nuxt 4 · Vue 3 · TypeScript · Tailwind CSS · GSAP + Lenis · Three.js (campo de partículas do hero) · Vercel.

## Estrutura

- `app/data/perfil.ts` — única fonte de conteúdo (perfil, experiência, projetos, competências, formação). A home e a página `/curriculo` leem daqui.
- `app/pages/index.vue` — home.
- `app/pages/curriculo.vue` — currículo em HTML com estilo de impressão (gera o PDF em `public/`).
- `app/components/HeroScene.vue` — cena Three.js (desligada em telas < 768 px e com `prefers-reduced-motion`).

## Rodando

```bash
npm install
npm run dev
```

## Atualizar o PDF do currículo

Com o servidor de desenvolvimento rodando:

```bash
npm run cv:pdf
```
