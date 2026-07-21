<script setup lang="ts">
import type { Project } from '~/types/project'

/**
 * Trilho horizontal: a página continua rolando na vertical, mas o conteúdo
 * anda para o lado. O truque é um container alto com filho sticky — o
 * progresso vertical vira `translateX`.
 *
 * A distância percorrida é medida (não chutada), então funciona com qualquer
 * quantidade de projetos e em qualquer largura de tela.
 */

const props = defineProps<{ projects: Project[] }>()

const root = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)
const viewport = ref<HTMLElement | null>(null)

const { progress } = useStickyProgress(root)
const { cursorOn } = useCursor()

const distance = ref(0)

function measure() {
  if (!track.value || !viewport.value) return
  distance.value = Math.max(0, track.value.scrollWidth - viewport.value.clientWidth)
}

let ro: ResizeObserver | null = null

onMounted(() => {
  measure()
  ro = new ResizeObserver(measure)
  if (track.value) ro.observe(track.value)
  if (viewport.value) ro.observe(viewport.value)
})

onBeforeUnmount(() => {
  ro?.disconnect()
  ro = null
})

/** Altura do container: uma tela de folga + o quanto precisa andar. */
const containerHeight = computed(() => `${100 + props.projects.length * 55}vh`)

const trackStyle = computed(() => ({
  transform: `translate3d(${-progress.value * distance.value}px, 0, 0)`,
}))
</script>

<template>
  <section ref="root" class="relative" :style="{ height: containerHeight }">
    <div ref="viewport" class="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
      <div class="container-x mb-10 flex items-end justify-between gap-8">
        <div class="flex flex-col gap-4">
          <span class="eyebrow text-brass">Todos os projetos</span>
          <h2 class="text-title max-w-[16ch]">
            O acervo completo.
          </h2>
        </div>
        <span class="hidden items-center gap-3 text-xs text-stone lg:flex">
          Role para o lado
          <span class="h-px w-16 bg-line">
            <span class="block h-full origin-left bg-brass" :style="{ transform: `scaleX(${progress})` }" />
          </span>
        </span>
      </div>

      <div
        ref="track"
        class="flex w-max gap-6 pl-[clamp(1.25rem,5vw,5rem)] pr-[20vw] will-change-transform"
        :style="trackStyle"
      >
        <NuxtLink
          v-for="(project, i) in projects"
          :key="project.path"
          :to="project.path"
          class="group relative block w-[clamp(16rem,26vw,24rem)] shrink-0"
          v-bind="cursorOn('view', 'Ver')"
        >
          <div class="relative aspect-3/4 overflow-hidden rounded-xl bg-smoke">
            <UiMedia
              :media="project.cover"
              sizes="380px"
              class="h-full w-full transition-transform duration-1000 ease-out-expo group-hover:scale-105"
            />
            <div class="absolute inset-0 bg-void/30 transition-opacity duration-700 group-hover:opacity-0" />
            <span class="absolute left-4 top-4 text-xs text-bone/70 tabular-nums">
              {{ String(i + 1).padStart(2, '0') }}
            </span>
          </div>

          <div class="mt-4 flex flex-col gap-1">
            <span class="text-lg transition-colors duration-500 group-hover:text-brass">
              {{ project.title }}
            </span>
            <span class="text-sm text-linen/45">
              {{ project.category }} · {{ project.location }}
            </span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
