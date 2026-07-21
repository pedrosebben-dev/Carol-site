import tailwindcss from '@tailwindcss/vite'
import { siteConfig } from './site.config'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/fonts',
    '@vueuse/nuxt',
  ],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  typescript: {
    strict: true,
    // Rode `npm run typecheck` separado — mantém o dev server rápido.
    typeCheck: false,
  },

  experimental: {
    // View Transitions API nativa entre rotas (morph de imagem grid -> detalhe).
    viewTransition: true,
  },

  app: {
    head: {
      htmlAttrs: { lang: 'pt-BR' },
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
      meta: [
        { name: 'theme-color', content: '#0A0908' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
    },
  },

  content: {
    // Usa o SQLite embutido do Node (node:sqlite) em vez do better-sqlite3.
    // Evita compilação nativa no install — o projeto instala em segundos e
    // o build da Vercel não precisa de toolchain C++. Requer Node 22+.
    experimental: { nativeSqlite: true },
    build: {
      markdown: {
        toc: { depth: 2 },
      },
    },
  },

  image: {
    quality: 78,
    format: ['avif', 'webp'],
    screens: {
      xs: 360,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },

  fonts: {
    families: [
      { name: 'Fraunces', provider: 'google', weights: [300, 400, 500, 600] },
      { name: 'Inter', provider: 'google', weights: [300, 400, 500, 600] },
    ],
  },

  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || siteConfig.url,
    },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/portfolio', '/projetos'],
    },
  },
})
