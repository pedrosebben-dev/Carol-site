<script setup lang="ts">
import { services } from '~/data/home'

/**
 * Página de um serviço — no mesmo nível cinematográfico do resto do site.
 *
 * Efeitos: capa com parallax + número fantasma, título em máscara de linha,
 * frase-manifesto revelada palavra por palavra, faixa com o nome do serviço,
 * "o que inclui" com rótulo fixo (sticky) e entrada em cascata, CTA com brilho
 * e transição morph (View Transitions) da imagem ao ir para o próximo serviço.
 *
 * Dados vêm do array `services` da home — criar/editar é mexer em um só arquivo.
 */

const route = useRoute()
const { site, whatsappLink } = useSite()
const { cursorOn } = useCursor()

const service = computed(() => services.find(s => s.slug === route.params.slug))

// 404 no carregamento inicial (URL direta / SSR).
if (!service.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Serviço não encontrado',
    fatal: true,
  })
}

const s = computed(() => service.value!)
const index = computed(() => services.findIndex(x => x.slug === route.params.slug))
const counter = computed(() => String(index.value + 1).padStart(2, '0'))
const introWords = computed(() => s.value.intro.split(' '))

// Próximo serviço — circula (com morph da imagem via View Transitions).
const nextIndex = computed(() => (index.value + 1) % services.length)
const next = computed(() => services[nextIndex.value]!)
const nextCounter = computed(() => String(nextIndex.value + 1).padStart(2, '0'))

// Parallax da capa, tudo derivado do mesmo scrollY (um cálculo por frame).
const { scrollY } = useScrollState()
const vh = ref(1000)
onMounted(() => {
  vh.value = window.innerHeight
  useEventListener(window, 'resize', () => { vh.value = window.innerHeight })
})
const p = computed(() => Math.min(1, scrollY.value / vh.value))

const mediaStyle = computed(() => ({
  transform: `translate3d(0, ${p.value * 16}vh, 0) scale(${1 + p.value * 0.12})`,
}))
const ghostStyle = computed(() => ({
  transform: `translate3d(0, ${p.value * -14}vh, 0)`,
}))
const contentStyle = computed(() => ({
  transform: `translate3d(0, ${p.value * -6}vh, 0)`,
  opacity: String(Math.max(0, 1 - p.value * 1.5)),
}))

useSeoMeta({
  title: () => `${s.value.title} — Serviços`,
  description: () => s.value.intro,
  ogTitle: () => `${s.value.title} — ${site.legalName}`,
  ogDescription: () => s.value.description,
  ogImage: () => s.value.media,
})
</script>

<template>
  <article v-if="service">
    <!-- ============================ Capa ============================ -->
    <header class="relative flex h-svh min-h-[34rem] flex-col overflow-hidden">
      <!-- Número fantasma gigante, atrás de tudo -->
      <span
        class="pointer-events-none absolute -right-[3vw] top-[6vh] z-0 select-none font-display leading-none text-bone/[0.05] will-change-transform"
        :style="ghostStyle"
        aria-hidden="true"
      >
        <span class="text-[38vw]">{{ counter }}</span>
      </span>

      <!-- Mídia de fundo em parallax -->
      <div class="absolute inset-0 z-0 will-change-transform" :style="mediaStyle">
        <div class="h-full w-full" :style="{ viewTransitionName: `servico-${s.slug}` }">
          <UiMedia :media="{ src: s.media, alt: s.title }" eager class="h-full w-full" />
        </div>
        <div class="absolute inset-0 bg-gradient-to-t from-void via-void/55 to-void/70" />
      </div>

      <!-- Conteúdo -->
      <div
        class="container-x relative z-10 mt-auto flex flex-col pb-[clamp(2.5rem,7vh,5rem)] will-change-transform"
        :style="contentStyle"
      >
        <NuxtLink
          to="/#servicos"
          class="link-underline mb-10 w-fit text-sm text-linen/70 transition-colors hover:text-bone"
        >
          ← Todos os serviços
        </NuxtLink>

        <span class="eyebrow mb-6 flex items-center gap-4 text-brass">
          <span class="tabular-nums">{{ counter }}</span>
          <span class="h-px w-10 bg-brass/50" />
          <span class="text-linen/70">Serviço</span>
        </span>

        <h1 class="text-hero font-display max-w-[14ch]">
          <span class="line-mask is-visible">
            <span :style="{ '--reveal-delay': '150ms' }">{{ s.title }}</span>
          </span>
        </h1>

        <p
          v-reveal
          class="reveal text-lead mt-8 max-w-[46ch] text-linen/70"
          :style="{ '--reveal-delay': '400ms' }"
        >
          {{ s.description }}
        </p>
      </div>

      <!-- Indicador de scroll -->
      <div
        class="pointer-events-none absolute bottom-6 right-[clamp(1.25rem,5vw,5rem)] z-10 hidden flex-col items-center gap-3 lg:flex"
        :style="{ opacity: String(Math.max(0, 1 - p * 3)) }"
      >
        <span class="eyebrow [writing-mode:vertical-rl] text-linen/45">Role</span>
        <span class="relative h-14 w-px overflow-hidden bg-linen/20">
          <span class="absolute inset-x-0 top-0 h-1/2 animate-[reveal-up_1.6s_ease-in-out_infinite] bg-brass" />
        </span>
      </div>
    </header>

    <!-- ===================== Frase-manifesto ===================== -->
    <section class="relative overflow-hidden bg-void py-[clamp(5rem,12vw,10rem)]">
      <div class="container-x grid gap-10 lg:grid-cols-[0.3fr_0.7fr] lg:gap-16">
        <div v-reveal class="reveal flex items-center gap-4 text-brass lg:flex-col lg:items-start lg:gap-6">
          <span class="h-px w-10 bg-brass/50 lg:h-16 lg:w-px" />
          <span class="eyebrow text-linen/60">O serviço</span>
        </div>

        <p
          v-reveal
          class="max-w-[22ch] font-display text-[clamp(1.6rem,3.6vw,3rem)] leading-[1.3] text-bone/90"
        >
          <template v-for="(word, i) in introWords" :key="`${word}-${i}`">
            <span
              class="line-mask"
              :style="{ display: 'inline-block', verticalAlign: 'top', paddingBottom: '0.15em' }"
            ><span :style="{ display: 'inline-block', '--reveal-delay': `${100 + i * 24}ms` }">{{ word }}</span></span>{{ ' ' }}
          </template>
        </p>
      </div>
    </section>

    <!-- Faixa com o nome do serviço -->
    <UiMarquee :text="s.title" :speed="44" />

    <!-- ======================= O que inclui ======================= -->
    <section class="bg-ink py-[clamp(5rem,12vw,10rem)]">
      <div class="container-x grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div class="flex flex-col gap-5 lg:sticky lg:top-32 lg:self-start">
          <div class="flex items-center gap-4 text-brass">
            <span class="h-px w-10 bg-brass/50" />
            <span class="eyebrow text-linen/70">O que inclui</span>
          </div>
          <h2 class="text-title font-display max-w-[12ch]">
            Tudo que você recebe.
          </h2>
          <p class="text-sm text-linen/45 tabular-nums">
            {{ String(s.includes.length).padStart(2, '0') }} entregáveis
          </p>
        </div>

        <ul class="flex flex-col">
          <li
            v-for="(item, i) in s.includes"
            :key="item"
            v-reveal="{ delay: i * 90 }"
            class="reveal group grid grid-cols-[auto_1fr] items-baseline gap-6 border-b border-line/50 py-7 first:border-t first:border-line/50"
          >
            <span class="font-display text-2xl tabular-nums text-brass/70 transition-colors duration-500 group-hover:text-brass">
              {{ String(i + 1).padStart(2, '0') }}
            </span>
            <span class="text-[clamp(1.05rem,1.7vw,1.4rem)] leading-snug text-linen/85 transition-colors duration-500 group-hover:text-bone">
              {{ item }}
            </span>
          </li>
        </ul>
      </div>
    </section>

    <!-- ============================ CTA ============================ -->
    <section class="relative overflow-hidden bg-void py-[clamp(6rem,14vw,12rem)]">
      <!-- Brilho em latão, no fundo -->
      <div
        class="pointer-events-none absolute inset-x-0 bottom-[-30%] top-[10%] mix-blend-soft-light"
        :style="{ background: 'radial-gradient(60% 55% at 50% 60%, var(--color-brass), transparent 70%)' }"
        aria-hidden="true"
      />

      <div class="container-x relative flex flex-col items-center gap-10 text-center">
        <span v-reveal class="reveal eyebrow text-brass">
          {{ counter }} — {{ s.title }}
        </span>
        <p v-reveal class="reveal text-display font-display max-w-[16ch]" :style="{ '--reveal-delay': '120ms' }">
          Vamos tirar o seu projeto do papel.
        </p>
        <div v-reveal class="reveal" :style="{ '--reveal-delay': '240ms' }">
          <UiButton :href="whatsappLink(`Olá! Tenho interesse em ${s.title}. Podemos conversar sobre um orçamento?`)">
            Pedir orçamento
          </UiButton>
        </div>
      </div>
    </section>

    <!-- ====================== Próximo serviço ====================== -->
    <NuxtLink
      :to="`/servicos/${next.slug}`"
      class="group relative block h-[62svh] min-h-[22rem] overflow-hidden"
      v-bind="cursorOn('view', 'Ver')"
    >
      <div class="absolute inset-0" :style="{ viewTransitionName: `servico-${next.slug}` }">
        <UiMedia
          :media="{ src: next.media, alt: next.title }"
          class="h-full w-full transition-transform duration-1000 ease-out-expo group-hover:scale-105"
        />
      </div>
      <div class="absolute inset-0 bg-void/72 transition-colors duration-700 group-hover:bg-void/55" />

      <div class="container-x absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
        <span class="eyebrow text-brass">Próximo serviço · {{ nextCounter }}</span>
        <span class="text-display font-display max-w-[16ch] transition-transform duration-700 ease-out-expo group-hover:-translate-y-1">
          {{ next.title }}
        </span>
      </div>
    </NuxtLink>
  </article>
</template>
