<script setup lang="ts">
import { perfil, experiencias, projetos, competencias, formacao, cursos } from '~/data/perfil'

useSeoMeta({
  title: 'Currículo — Isaque Araujo',
  description: 'Currículo de Isaque Araujo: desenvolvedor full stack, estagiário de T.I. na Gaseo e estudante de Ciências da Computação.',
  robots: 'index, follow',
})

const imprimir = () => window.print()
</script>

<template>
  <div class="curriculo min-h-[100dvh] bg-brand-dark print:bg-white print:text-black">
    <div class="max-w-3xl mx-auto px-5 md:px-8 pt-28 pb-24 print:pt-0 print:pb-0 print:px-0">
      <div class="no-print flex flex-wrap items-center justify-between gap-4 mb-10">
        <a href="/" class="text-[11px] font-mono tracking-[0.2em] uppercase text-gray-400 hover:text-white transition-colors">← voltar ao portfólio</a>
        <div class="flex gap-3">
          <a href="/Isaque_Araujo_Curriculo.pdf" download class="btn-ghost !py-2.5">baixar PDF</a>
          <button @click="imprimir" class="btn-primary !py-2.5">imprimir</button>
        </div>
      </div>

      <header class="border-b border-white/10 print:border-black/20 pb-6 mb-8">
        <h1 class="font-display font-bold tracking-tight text-white print:text-black text-3xl md:text-4xl">{{ perfil.nomeCompleto }}</h1>
        <p class="mt-1 text-brand-accent print:text-black font-medium">{{ perfil.titulo }}</p>
        <p class="mt-3 text-sm text-gray-400 print:text-gray-700 flex flex-wrap gap-x-4 gap-y-1">
          <span>{{ perfil.cidade }}</span>
          <a :href="`mailto:${perfil.email}`" class="hover:text-white">{{ perfil.email }}</a>
          <a :href="perfil.linkedin" target="_blank" rel="noopener" class="hover:text-white">linkedin.com/in/isaque-araujo0</a>
          <a :href="perfil.github" target="_blank" rel="noopener" class="hover:text-white">github.com/isaquewho</a>
          <a :href="perfil.site" class="hover:text-white">isaque-araujo.vercel.app</a>
        </p>
      </header>

      <section class="mb-8">
        <h2 class="cv-h2">Perfil</h2>
        <p class="cv-p">{{ perfil.resumo }}</p>
      </section>

      <section class="mb-8">
        <h2 class="cv-h2">Experiência profissional</h2>
        <article v-for="exp in experiencias" :key="exp.empresa" class="mb-5">
          <div class="flex flex-wrap justify-between gap-2 items-baseline">
            <h3 class="font-semibold text-white print:text-black">{{ exp.cargo }} · {{ exp.empresa }}</h3>
            <span class="text-xs font-mono text-gray-500 print:text-gray-600">{{ exp.periodo }} · {{ exp.local }}</span>
          </div>
          <ul class="mt-2 space-y-1.5">
            <li v-for="p in exp.pontos" :key="p" class="cv-li">{{ p }}</li>
          </ul>
        </article>
      </section>

      <section class="mb-8">
        <h2 class="cv-h2">Projetos</h2>
        <article v-for="p in projetos" :key="p.slug" class="mb-4 break-inside-avoid">
          <div class="flex flex-wrap justify-between gap-2 items-baseline">
            <h3 class="font-semibold text-white print:text-black">{{ p.titulo }} <span class="font-normal text-gray-500 print:text-gray-600 text-sm">· {{ p.categoria }}</span></h3>
            <a v-if="p.link" :href="p.link" class="text-xs font-mono text-gray-500 print:text-gray-600">{{ p.link.replace('https://', '') }}</a>
            <span v-else class="text-xs font-mono text-gray-500 print:text-gray-600">{{ p.status }}</span>
          </div>
          <p class="cv-p mt-1">{{ p.descricao }}</p>
          <ul class="mt-1.5 space-y-1">
            <li v-for="d in p.destaques" :key="d" class="cv-li">{{ d }}</li>
          </ul>
          <p class="mt-1.5 text-xs text-gray-500 print:text-gray-600">Stack: {{ p.stack.join(', ') }}</p>
        </article>
      </section>

      <section class="mb-8 break-inside-avoid">
        <h2 class="cv-h2">Competências técnicas</h2>
        <ul class="space-y-1.5">
          <li v-for="c in competencias" :key="c.grupo" class="text-sm text-gray-400 print:text-gray-800">
            <strong class="text-white print:text-black font-semibold">{{ c.grupo }}:</strong> {{ c.itens.join(', ') }}
          </li>
        </ul>
      </section>

      <section class="mb-8 grid sm:grid-cols-2 gap-8 break-inside-avoid">
        <div>
          <h2 class="cv-h2">Formação</h2>
          <ul class="space-y-2">
            <li v-for="f in formacao" :key="f.curso" class="text-sm">
              <p class="text-white print:text-black font-semibold">{{ f.curso }}</p>
              <p class="text-gray-500 print:text-gray-600 text-xs">{{ f.instituicao }} · {{ f.periodo }}</p>
            </li>
          </ul>
        </div>
        <div>
          <h2 class="cv-h2">Idiomas e cursos</h2>
          <ul class="space-y-1.5">
            <li v-for="c in cursos" :key="c" class="cv-li">{{ c }}</li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.cv-h2 {
  @apply text-[11px] font-mono tracking-[0.2em] uppercase text-brand-accent print:text-black mb-3;
}
.cv-p {
  @apply text-sm text-gray-400 print:text-gray-800 leading-relaxed;
}
.cv-li {
  @apply text-sm text-gray-400 print:text-gray-800 leading-relaxed pl-4 relative;
}
.cv-li::before {
  content: '';
  @apply absolute left-0 top-[0.6em] h-1 w-1 rounded-full bg-brand-accent print:bg-black;
}
@media print {
  @page { margin: 14mm; size: A4; }
  .curriculo { font-size: 11pt; }
}
</style>
