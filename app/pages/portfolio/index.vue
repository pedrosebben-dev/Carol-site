<script setup lang="ts">
import type { Project } from '~/types/project'
import { projectCategories } from '~~/shared/categories'

/**
 * Grade tradicional com filtro por categoria. Complementa a página imersiva:
 * quem quer navegar rápido e comparar projetos vem para cá.
 *
 * O filtro fica na URL (?categoria=Comercial) para o link ser compartilhável
 * e o botão voltar do navegador funcionar.
 */

const { site } = useSite()
const route = useRoute()
const router = useRouter()

const { data } = await useAsyncData('portfolio-grade', () =>
  queryCollection('portfolio').order('order', 'ASC').all())

const projects = computed(() => (data.value ?? []) as unknown as Project[])

const activeCategory = computed(() => (route.query.categoria as string | undefined) ?? 'Todos')

const filtered = computed(() =>
  activeCategory.value === 'Todos'
    ? projects.value
    : projects.value.filter(p => p.category === activeCategory.value))

/** Só mostra filtros que de fato têm projeto. */
const availableCategories = computed(() => {
  const used = new Set(projects.value.map(p => p.category))
  return ['Todos', ...projectCategories.filter(c => used.has(c))]
})

function setCategory(category: string) {
  router.replace({
    query: category === 'Todos' ? {} : { categoria: category },
  })
}

useSeoMeta({
  title: 'Portfólio',
  description: `Todos os projetos de interiores entregues pelo ${site.legalName}, filtráveis por categoria.`,
  ogTitle: `Portfólio — ${site.legalName}`,
  ogImage: '/media/og/projetos.jpg',
})
</script>

<template>
  <div class="pt-[clamp(7rem,14vh,11rem)]">
    <div class="container-x">
      <header class="flex flex-col gap-8">
        <p v-reveal class="reveal eyebrow text-brass">
          Portfólio
        </p>
        <h1 class="text-display max-w-[14ch] leading-[1.12]">
          <span class="line-mask is-visible pb-[0.12em]"><span :style="{ '--reveal-delay': '120ms' }">Projetos entregues.</span></span>
        </h1>

        <div class="flex flex-wrap items-center justify-between gap-6 border-b border-line/60 pb-6">
          <!-- Filtros -->
          <div class="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoria">
            <button
              v-for="category in availableCategories"
              :key="category"
              class="rounded-full border px-4 py-2 text-sm transition-colors duration-400"
              :class="activeCategory === category
                ? 'border-brass bg-brass text-void'
                : 'border-line text-linen/65 hover:border-linen/40 hover:text-bone'"
              :aria-pressed="activeCategory === category"
              @click="setCategory(category)"
            >
              {{ category }}
            </button>
          </div>

          <span class="text-sm text-stone tabular-nums">
            {{ filtered.length }} {{ filtered.length === 1 ? 'projeto' : 'projetos' }}
          </span>
        </div>
      </header>

      <!-- Grade -->
      <TransitionGroup
        tag="div"
        class="grid gap-x-8 gap-y-16 py-16 md:grid-cols-2 lg:grid-cols-3"
        enter-active-class="transition-all duration-600 ease-out-expo"
        enter-from-class="opacity-0 translate-y-8"
        leave-active-class="absolute transition-all duration-300 ease-out"
        leave-to-class="opacity-0 scale-95"
        move-class="transition-transform duration-600 ease-out-expo"
      >
        <ProjectCard
          v-for="(project, i) in filtered"
          :key="project.path"
          :project="project"
          :index="i"
        />
      </TransitionGroup>

      <p v-if="!filtered.length" class="py-24 text-center text-linen/50">
        Nenhum projeto nesta categoria ainda.
      </p>
    </div>

    <HomeCta />
  </div>
</template>
