<script setup lang="ts">
import type { Project } from '~/types/project'
import { projectSlug } from '~/types/project'

/**
 * Página de um projeto: capa em parallax, ficha técnica, texto em markdown,
 * galeria com spans variáveis e link para o próximo projeto.
 */

const route = useRoute()
const { site, whatsappLink } = useSite()

const { data: project } = await useAsyncData(`projeto-${route.path}`, () =>
  queryCollection('portfolio').path(route.path).first())

if (!project.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Projeto não encontrado',
    fatal: true,
  })
}

const item = computed(() => project.value as unknown as Project)

// Próximo projeto — mantém o visitante circulando pelo portfólio.
const { data: all } = await useAsyncData('portfolio-ordem', () =>
  queryCollection('portfolio').order('order', 'ASC').all())

const next = computed(() => {
  const list = (all.value ?? []) as unknown as Project[]
  const i = list.findIndex(p => p.path === route.path)
  return i >= 0 ? list[(i + 1) % list.length] : undefined
})

// Parallax da capa.
const heroRef = ref<HTMLElement | null>(null)
const { scrollY } = useScrollState()
const heroStyle = computed(() => ({
  transform: `translate3d(0, ${Math.min(scrollY.value * 0.35, 400)}px, 0) scale(1.1)`,
}))

const slug = computed(() => projectSlug(item.value))

/** Classes de grid por span — mantém a galeria irregular sem CSS solto. */
function spanClass(span?: string) {
  switch (span) {
    case 'wide': return 'md:col-span-2'
    case 'tall': return 'md:row-span-2'
    case 'full': return 'md:col-span-3'
    default: return ''
  }
}

function spanRatio(span?: string) {
  switch (span) {
    case 'wide': return '16/9'
    case 'tall': return '3/4'
    case 'full': return '21/9'
    default: return '4/5'
  }
}

useSeoMeta({
  title: () => item.value.title,
  description: () => `${item.value.subtitle} — projeto de interiores em ${item.value.location}, ${item.value.area}, entregue em ${item.value.year}.`,
  ogTitle: () => `${item.value.title} — ${site.legalName}`,
  ogDescription: () => item.value.subtitle,
  ogImage: () => item.value.cover.poster ?? item.value.cover.src,
})
</script>

<template>
  <article v-if="item">
    <!-- Capa -->
    <header ref="heroRef" class="relative h-svh min-h-[32rem] overflow-hidden">
      <div
        class="absolute inset-0 will-change-transform"
        :style="[heroStyle, { viewTransitionName: `project-${slug}` }]"
      >
        <UiMedia :media="item.cover" eager class="h-full w-full" />
        <div class="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-void/60" />
      </div>

      <div class="container-x relative flex h-full flex-col justify-end pb-[clamp(2.5rem,7vh,5rem)]">
        <NuxtLink
          to="/portfolio"
          class="link-underline mb-8 w-fit text-sm text-linen/70 transition-colors hover:text-bone"
        >
          ← Portfólio
        </NuxtLink>

        <span class="eyebrow mb-5 text-brass">{{ item.category }}</span>

        <h1 class="text-display font-display max-w-[15ch]">
          {{ item.title }}
        </h1>

        <p class="text-lead mt-5 max-w-[48ch] text-linen/70">
          {{ item.subtitle }}
        </p>
      </div>
    </header>

    <!-- Ficha técnica -->
    <section class="border-y border-line/60 bg-ink">
      <dl class="container-x grid grid-cols-2 gap-x-8 gap-y-8 py-10 sm:grid-cols-4">
        <div class="flex flex-col gap-2">
          <dt class="eyebrow text-brass">
            Local
          </dt>
          <dd>{{ item.location }}</dd>
        </div>
        <div class="flex flex-col gap-2">
          <dt class="eyebrow text-brass">
            Ano
          </dt>
          <dd class="tabular-nums">
            {{ item.year }}
          </dd>
        </div>
        <div class="flex flex-col gap-2">
          <dt class="eyebrow text-brass">
            Área
          </dt>
          <dd>{{ item.area }}</dd>
        </div>
        <div class="flex flex-col gap-2">
          <dt class="eyebrow text-brass">
            Escopo
          </dt>
          <dd class="flex flex-col gap-1">
            <span v-for="s in item.scope" :key="s">{{ s }}</span>
          </dd>
        </div>
      </dl>
    </section>

    <!-- Texto do projeto (markdown) -->
    <section class="container-x py-[clamp(4rem,9vw,8rem)]">
      <div v-reveal class="reveal prose-projeto mx-auto max-w-[68ch]">
        <ContentRenderer :value="project!" />
      </div>
    </section>

    <!-- Galeria -->
    <section v-if="item.gallery.length" class="container-x pb-[clamp(4rem,9vw,8rem)]">
      <div class="grid auto-rows-auto gap-4 md:grid-cols-3">
        <figure
          v-for="(media, i) in item.gallery"
          :key="media.src"
          v-reveal="{ delay: (i % 3) * 100 }"
          class="reveal-clip overflow-hidden rounded-xl"
          :class="spanClass(media.span)"
        >
          <UiMedia
            :media="media"
            :ratio="spanRatio(media.span)"
            sizes="sm:100vw md:50vw lg:33vw"
            class="h-full w-full"
          />
        </figure>
      </div>
    </section>

    <!-- CTA + próximo projeto -->
    <section class="container-x pb-[clamp(4rem,9vw,8rem)]">
      <div class="flex flex-col gap-6 rounded-2xl border border-line/70 bg-ink p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10">
        <div class="flex flex-col gap-2">
          <span class="eyebrow text-brass">Gostou deste projeto?</span>
          <p class="text-[clamp(1.2rem,2.2vw,1.6rem)] leading-snug">
            O seu pode começar esta semana.
          </p>
        </div>
        <UiButton :href="whatsappLink(`Olá! Vi o projeto ${item.title} no site e gostaria de um orçamento.`)">
          Falar no WhatsApp
        </UiButton>
      </div>
    </section>

    <NuxtLink
      v-if="next"
      :to="next.path"
      class="group relative block h-[60vh] min-h-[22rem] overflow-hidden"
    >
      <UiMedia
        :media="next.cover"
        class="h-full w-full transition-transform duration-1000 ease-out-expo group-hover:scale-105"
      />
      <div class="absolute inset-0 bg-void/70 transition-colors duration-700 group-hover:bg-void/55" />

      <div class="container-x absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
        <span class="eyebrow text-brass">Próximo projeto</span>
        <span class="text-display font-display max-w-[14ch]">{{ next.title }}</span>
        <span class="text-sm text-linen/60">{{ next.location }} · {{ next.year }}</span>
      </div>
    </NuxtLink>
  </article>
</template>

<style scoped>
/* Estilos do markdown do projeto — mantidos aqui em vez de puxar o
   plugin de typography só por causa de uma página. */
.prose-projeto :deep(h2) {
  font-size: clamp(1.5rem, 2.8vw, 2.25rem);
  line-height: 1.15;
  margin-block: 2.5rem 1rem;
}

.prose-projeto :deep(h3) {
  font-size: clamp(1.2rem, 2vw, 1.5rem);
  margin-block: 2rem 0.75rem;
}

.prose-projeto :deep(p) {
  color: color-mix(in oklab, var(--color-linen) 68%, transparent);
  font-size: clamp(1.0625rem, 1.3vw, 1.2rem);
  line-height: 1.7;
  margin-block: 1.25rem;
}

.prose-projeto :deep(ul) {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-block: 1.5rem;
}

.prose-projeto :deep(li) {
  color: color-mix(in oklab, var(--color-linen) 65%, transparent);
  padding-left: 1.4rem;
  position: relative;
}

.prose-projeto :deep(li)::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.7em;
  width: 0.4rem;
  height: 1px;
  background: var(--color-brass);
}

.prose-projeto :deep(blockquote) {
  border-left: 2px solid var(--color-brass);
  padding-left: 1.5rem;
  margin-block: 2rem;
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 2vw, 1.55rem);
  line-height: 1.4;
  color: var(--color-bone);
}

.prose-projeto :deep(strong) {
  color: var(--color-bone);
  font-weight: 500;
}
</style>
