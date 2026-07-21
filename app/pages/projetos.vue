<script setup lang="ts">
import type { Project } from '~/types/project'

/**
 * Página imersiva do portfólio.
 *
 * Sequência: intro em tela cheia → uma cena pinada por projeto → trilho
 * horizontal com o acervo → CTA. Um rail fixo à esquerda marca em que
 * projeto você está e a cor de acento do site acompanha a cena ativa.
 */

const { site } = useSite()

const { data } = await useAsyncData('projetos-todos', () =>
  queryCollection('portfolio').order('order', 'ASC').all())

const projects = computed(() => (data.value ?? []) as unknown as Project[])
const scenes = computed(() => projects.value.slice(0, 6))

const activeIndex = ref(0)
const accent = ref('#C8A15B')

function onSceneActive(index: number, color: string) {
  activeIndex.value = index
  accent.value = color
}

const { scrollY } = useScrollState()
/** O rail e o contador só aparecem depois da intro. */
const chromeVisible = computed(() => scrollY.value > 400)

useSeoMeta({
  title: 'Projetos',
  description: `Portfólio de projetos de interiores do ${site.legalName}: residenciais, comerciais e corporativos, com render 3D e obra acompanhada.`,
  ogTitle: `Projetos — ${site.legalName}`,
  ogDescription: 'Uma seleção de ambientes residenciais e comerciais entregues pelo estúdio.',
  ogImage: '/media/og/projetos.jpg',
})
</script>

<template>
  <div
    class="relative bg-void transition-colors duration-1000"
    :style="{ '--scene-accent': accent }"
  >
    <!-- Intro -->
    <section class="relative flex h-svh min-h-[34rem] flex-col justify-end overflow-hidden">
      <div class="container-x pb-[clamp(3rem,8vh,6rem)]">
        <p v-reveal class="reveal eyebrow mb-8 text-brass">
          Portfólio — {{ projects.length }} projetos
        </p>

        <h1 class="text-hero font-display max-w-[12ch]">
          <span class="line-mask is-visible"><span :style="{ '--reveal-delay': '150ms' }">Cada projeto</span></span>
          <span class="line-mask is-visible"><span :style="{ '--reveal-delay': '260ms' }" class="text-brass italic">uma história.</span></span>
        </h1>

        <div class="mt-10 flex flex-col gap-6 border-t border-line/60 pt-8 lg:flex-row lg:items-end lg:justify-between">
          <p v-reveal class="reveal text-lead max-w-[46ch] text-linen/65" :style="{ '--reveal-delay': '380ms' }">
            Role para atravessar os projetos. Cada cena abre em tela cheia — se
            preferir uma grade tradicional, ela também está disponível.
          </p>
          <UiButton to="/portfolio" variant="outline">
            Ver em grade
          </UiButton>
        </div>
      </div>

      <!-- Ruído de fundo sutil na cor de acento -->
      <div
        class="pointer-events-none absolute inset-0 -z-10 opacity-40"
        :style="{ background: `radial-gradient(70% 50% at 70% 20%, ${accent}22, transparent 70%)` }"
      />
    </section>

    <!-- Rail de progresso -->
    <ClientOnly>
      <div
        class="pointer-events-none fixed left-[clamp(1.25rem,3vw,2.5rem)] top-1/2 z-[110] hidden -translate-y-1/2 flex-col gap-3 transition-opacity duration-700 lg:flex"
        :class="chromeVisible ? 'opacity-100' : 'opacity-0'"
        aria-hidden="true"
      >
        <span
          v-for="(project, i) in scenes"
          :key="project.path"
          class="h-8 w-px transition-colors duration-500"
          :class="i === activeIndex ? 'bg-brass' : 'bg-line'"
        />
        <span class="mt-3 text-[10px] tabular-nums text-stone [writing-mode:vertical-rl]">
          {{ String(activeIndex + 1).padStart(2, '0') }}
        </span>
      </div>
    </ClientOnly>

    <!-- Cenas pinadas -->
    <ProjectScene
      v-for="(project, i) in scenes"
      :key="project.path"
      :project="project"
      :index="i"
      :total="scenes.length"
      @active="onSceneActive"
    />

    <!-- Acervo em trilho horizontal -->
    <ProjectHorizontal v-if="projects.length > 1" :projects="projects" />

    <UiMarquee text="Vamos projetar o seu" :speed="24" reverse />

    <HomeCta />
  </div>
</template>
