<script setup lang="ts">
import type { Project } from '~/types/project'
import { mapRange } from '~/composables/useElementProgress'
import { projectSlug } from '~/types/project'

/**
 * Cena imersiva de um projeto.
 *
 * O container tem 300vh de altura e o conteúdo dentro dele é `sticky`, então
 * a cena fica travada na tela enquanto você rola 3 telas — é esse "tempo
 * parado" que dá espaço para a mídia se transformar.
 *
 * A transformação é dividida em três atos, todos derivados do mesmo
 * progresso 0..1:
 *   0.00 → 0.38  a mídia abre de um retângulo central para tela cheia
 *   0.38 → 0.72  a mídia descansa e os metadados entram
 *   0.72 → 1.00  a mídia recua em escala e escurece, preparando a próxima
 *
 * Tudo roda em clip-path/transform/opacity — propriedades compostas na GPU,
 * sem reflow. Por isso a cena aguenta vídeo em 4K sem engasgar.
 */

const props = defineProps<{
  project: Project
  index: number
  total: number
}>()

const emit = defineEmits<{ active: [index: number, accent: string] }>()

const root = ref<HTMLElement | null>(null)
const { progress, active } = useStickyProgress(root)
const { cursorOn } = useCursor()

watch(active, (isActive) => {
  if (isActive) emit('active', props.index, props.project.accent)
})

/** Ato 1 — abertura. */
const mediaStyle = computed(() => {
  const insetX = mapRange(progress.value, 0, 0.38, 22, 0)
  const insetY = mapRange(progress.value, 0, 0.38, 18, 0)
  const radius = mapRange(progress.value, 0, 0.38, 1.5, 0)
  const scale = mapRange(progress.value, 0, 0.38, 1.32, 1)
  // Ato 3 — recuo.
  const exit = mapRange(progress.value, 0.72, 1, 0, 1)

  return {
    clipPath: `inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${radius}rem)`,
    transform: `scale(${scale - exit * 0.06})`,
  }
})

/** Escurece no fim para a próxima cena entrar sem competir. */
const veilStyle = computed(() => ({
  opacity: String(0.28 + mapRange(progress.value, 0.72, 1, 0, 0.5)),
}))

/** O título sobe devagar durante toda a cena — paralaxe de texto. */
const titleStyle = computed(() => ({
  transform: `translate3d(0, ${mapRange(progress.value, 0, 1, 6, -6)}vh, 0)`,
  opacity: String(
    Math.min(
      mapRange(progress.value, 0.02, 0.2, 0, 1),
      1 - mapRange(progress.value, 0.86, 1, 0, 1),
    ),
  ),
}))

/** Ato 2 — metadados entram depois que a mídia terminou de abrir. */
const metaStyle = computed(() => {
  const t = mapRange(progress.value, 0.34, 0.52, 0, 1)
  return {
    transform: `translate3d(0, ${(1 - t) * 2.5}rem, 0)`,
    opacity: String(Math.min(t, 1 - mapRange(progress.value, 0.86, 1, 0, 1))),
  }
})

const slug = computed(() => projectSlug(props.project))
const counter = computed(() => String(props.index + 1).padStart(2, '0'))
</script>

<template>
  <section
    ref="root"
    class="relative h-[300vh]"
    :aria-label="`Projeto ${project.title}`"
  >
    <div class="sticky top-0 flex h-svh items-center justify-center overflow-hidden">
      <!-- Mídia -->
      <div class="absolute inset-0 will-change-[clip-path,transform]" :style="mediaStyle">
        <UiMedia
          :media="project.cover"
          :eager="index === 0"
          class="h-full w-full"
        />
        <div class="absolute inset-0 bg-void transition-opacity" :style="veilStyle" />
        <!-- Brilho na cor do projeto: dá identidade a cada cena -->
        <div
          class="absolute inset-0 mix-blend-soft-light"
          :style="{ background: `radial-gradient(80% 60% at 50% 100%, ${project.accent}, transparent 70%)` }"
        />
      </div>

      <!-- Título -->
      <div
        class="pointer-events-none relative z-10 px-6 text-center will-change-transform"
        :style="titleStyle"
      >
        <span class="eyebrow mb-6 block text-brass">
          {{ counter }} / {{ String(total).padStart(2, '0') }} — {{ project.category }}
        </span>
        <h2 class="text-hero font-display mx-auto max-w-[14ch] text-bone">
          {{ project.title }}
        </h2>
      </div>

      <!-- Metadados + link -->
      <div
        class="container-x absolute inset-x-0 bottom-0 z-10 pb-[clamp(2rem,5vh,4rem)] will-change-transform"
        :style="metaStyle"
      >
        <div class="flex flex-col gap-6 border-t border-bone/20 pt-6 lg:flex-row lg:items-end lg:justify-between">
          <dl class="grid grid-cols-2 gap-x-10 gap-y-5 sm:grid-cols-4">
            <div class="flex flex-col gap-1.5">
              <dt class="eyebrow text-bone/45">
                Local
              </dt>
              <dd class="text-bone">
                {{ project.location }}
              </dd>
            </div>
            <div class="flex flex-col gap-1.5">
              <dt class="eyebrow text-bone/45">
                Ano
              </dt>
              <dd class="text-bone tabular-nums">
                {{ project.year }}
              </dd>
            </div>
            <div class="flex flex-col gap-1.5">
              <dt class="eyebrow text-bone/45">
                Área
              </dt>
              <dd class="text-bone">
                {{ project.area }}
              </dd>
            </div>
            <div class="flex flex-col gap-1.5">
              <dt class="eyebrow text-bone/45">
                Escopo
              </dt>
              <dd class="text-bone">
                {{ project.scope[0] ?? '—' }}
              </dd>
            </div>
          </dl>

          <NuxtLink
            :to="project.path"
            class="group flex shrink-0 items-center gap-3 rounded-full border border-bone/30 px-6 py-3.5 text-sm text-bone transition-colors duration-500 hover:border-brass hover:bg-brass hover:text-void"
            v-bind="cursorOn('view', 'Abrir')"
            :style="{ viewTransitionName: `project-${slug}-link` }"
          >
            Ver o projeto completo
            <svg class="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
