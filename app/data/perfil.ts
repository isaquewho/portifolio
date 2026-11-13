export const perfil = {
  nome: 'Isaque Araujo',
  nomeCompleto: 'Isaque Araujo Dias da Silva',
  titulo: 'Desenvolvedor Full Stack & Estagiário de T.I.',
  cidade: 'Limeira, SP',
  email: 'isaquediass33@gmail.com',
  linkedin: 'https://linkedin.com/in/isaque-araujo0',
  github: 'https://github.com/isaquewho',
  site: 'https://isaque-araujo.vercel.app',
  resumo:
    'Estudante de Ciências da Computação e estagiário de T.I. na Gaseo, onde mantenho e evoluo sistemas internos em produção (PHP, NestJS e Angular). Fora do trabalho, construo produtos próprios do design à infraestrutura: um life OS financeiro com IA, um simulador de circuitos que roda ngspice no navegador e um sistema de delivery em uso por um restaurante.',
  disponibilidade: 'Aberto a vagas de estágio e júnior',
}

export const experiencias = [
  {
    cargo: 'Estagiário de T.I.',
    empresa: 'Gaseo Medicina Ocupacional',
    local: 'Iracemápolis, SP',
    periodo: 'abr 2026 — presente',
    resumo:
      'Desenvolvimento e manutenção dos sistemas internos da clínica, suporte a usuários e infraestrutura dos ambientes de desenvolvimento.',
    pontos: [
      'Monorepo Internal (NestJS + Angular + Prisma + PostgreSQL, SSO Authentik, gateway nginx): manutenção dos módulos de Chamados e Topologia de T.I., migração do módulo PCMSO/PGR a partir do sistema legado em Django.',
      'Regra de apuração independente de compliance nos Chamados: roteamento do chamado para o revisor da área oposta, com migrations, validação e QA em homologação.',
      'Central Gaseo (PHP + MySQL + Google OAuth): módulos de suporte, admissão, visitas e feedback; integração de assistente de IA (AnythingLLM) que responde tickets com base nos manuais internos.',
      'Validação de configuração por serviço no boot (APP_ENV + class-validator) em 7 serviços NestJS, timeout de sessão por inatividade e limpeza de scripts destrutivos do repositório.',
      'Releases seguindo política de deploy (homologação, release candidate, produção) com testes módulo a módulo em Docker/WSL.',
      'Help desk: triagem e acompanhamento de chamados, instalação e manutenção de sistemas e equipamentos.',
    ],
    stack: ['NestJS', 'Angular', 'Prisma', 'PostgreSQL', 'PHP', 'MySQL', 'Docker', 'nginx', 'Authentik', 'Django (legado)'],
  },
]

export type Projeto = {
  slug: string
  titulo: string
  categoria: string
  descricao: string
  destaques: string[]
  stack: string[]
  link?: string
  status: string
  video?: string
  webm?: string
}

export const projetos: Projeto[] = [
  {
    slug: 'nexus-life-os',
    titulo: 'Nexus Life OS',
    categoria: 'Produto próprio · SaaS',
    descricao:
      'Sistema operacional pessoal com finanças, hábitos gamificados, metas e um assistente que entende comandos em linguagem natural como "gastei 50 no uber".',
    destaques: [
      'Saldo Real e Safe to Spend calculados a partir de salário, fixas, variáveis e faturas de cartão.',
      'Hardening de segurança: auth server-side, rate limiting por usuário e IP, validação com Zod, CSP e checagem de ownership contra IDOR.',
      'Onboarding, waitlist com códigos de convite, painel admin e e-mails transacionais com Resend.',
    ],
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'PostgreSQL (Neon)', 'Drizzle ORM', 'Clerk', 'Zustand', 'Tailwind CSS 4'],
    link: 'https://nexus-life-os-web.vercel.app/pt-BR',
    status: 'Em produção',
    video: 'https://ydl44u2e7tjee9xl.public.blob.vercel-storage.com/nexus_life_os_demo.mp4',
    webm: 'https://ydl44u2e7tjee9xl.public.blob.vercel-storage.com/nexus_life_os_demo.webm',
  },
  {
    slug: 'circuit-lab',
    titulo: 'Circuit Lab',
    categoria: 'Projeto acadêmico · Engenharia',
    descricao:
      'Simulador educacional de circuitos eletrônicos 100% no navegador: editor de esquemas em SVG, biblioteca com modelos SPICE reais e simulação com ngspice compilado para WebAssembly.',
    destaques: [
      'Motor ngspice em Web Worker, sem servidor; instrumentos virtuais (osciloscópio, multímetro, gerador de sinais).',
      'Conectividade elétrica calculada da geometria do esquema (semântica KiCad) e projetos versionados com migrações de formato.',
      '174 testes unitários e de integração contra referências analíticas, 35 testes end-to-end com Playwright e auditoria de acessibilidade com axe.',
    ],
    stack: ['React 19', 'Vite', 'TypeScript', 'WebAssembly', 'ngspice', 'Web Workers', 'uPlot', 'Vitest', 'Playwright'],
    status: 'Em desenvolvimento',
  },
  {
    slug: 'casa-de-kisavita',
    titulo: 'Casa de KisaVita',
    categoria: 'Cliente real · Delivery',
    descricao:
      'Sistema de delivery para um restaurante: cardápio em tempo real, carrinho e envio do pedido direto para o WhatsApp, com painel administrativo para gerenciar produtos.',
    destaques: [
      'Single Page Application em JavaScript puro, sem framework, com Firestore como banco em tempo real.',
      'Painel administrativo com CRUD completo de cardápio e categorias.',
    ],
    stack: ['JavaScript', 'HTML5', 'CSS3', 'Firebase Firestore', 'Vercel'],
    link: 'https://restaurante-kisavita.vercel.app',
    status: 'Em produção',
    video: 'https://ydl44u2e7tjee9xl.public.blob.vercel-storage.com/kisavita_demo.mp4',
    webm: 'https://ydl44u2e7tjee9xl.public.blob.vercel-storage.com/kisavita_demo.webm',
  },
  {
    slug: 'central-gaseo',
    titulo: 'Central Gaseo',
    categoria: 'Trabalho · Plataforma interna',
    descricao:
      'Plataforma interna da Gaseo usada diariamente pelos colaboradores: chat e tickets de suporte, processo admissional, agendamento de veículos, visitas técnicas, feedback e módulos de SST.',
    destaques: [
      'Assistente de suporte com IA (AnythingLLM) que responde tickets usando os manuais do sistema como base de conhecimento.',
      'Autenticação Google OAuth 2.0, notificações Web Push e e-mails transacionais.',
    ],
    stack: ['PHP', 'MySQL', 'Google OAuth', 'Web Push', 'AnythingLLM'],
    status: 'Em produção (interno)',
  },
]

export const competencias = [
  { grupo: 'Frontend', itens: ['TypeScript', 'React 19', 'Next.js', 'Angular', 'Vue 3 / Nuxt', 'Tailwind CSS', 'GSAP', 'Three.js'] },
  { grupo: 'Backend', itens: ['Node.js', 'NestJS', 'Prisma', 'Drizzle ORM', 'PHP', 'Python', 'REST APIs'] },
  { grupo: 'Dados', itens: ['PostgreSQL', 'MySQL', 'Firebase Firestore', 'Neon Serverless'] },
  { grupo: 'Infra & DevOps', itens: ['Docker', 'nginx', 'Git / Gitflow', 'Vercel', 'WSL / Linux', 'Authentik (SSO)'] },
  { grupo: 'Qualidade & Segurança', itens: ['Vitest', 'Playwright', 'axe (WCAG)', 'Zod', 'Rate limiting', 'CSP / OWASP'] },
  { grupo: 'IA', itens: ['Integração de LLMs', 'Model Context Protocol', 'AnythingLLM', 'Claude Code', 'Engenharia de prompt'] },
]

export const formacao = [
  { curso: 'Bacharelado em Ciências da Computação', instituicao: 'UNIP', periodo: 'Cursando, noturno' },
  { curso: 'Técnico em Desenvolvimento de Sistemas', instituicao: 'FIEC / Dom Idílio José Soares', periodo: 'Concluído' },
]

export const cursos = [
  'Inglês técnico (leitura de documentação)',
  'Excel para Negócios — Senac',
  'Windows Essencial — Senac',
]
