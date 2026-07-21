<script setup lang="ts">
import type { Project } from '~/types/project'
import { projectSlug } from '~/types/project'

/**
 * Card de projeto com parallax interno: a mídia se move mais devagar que o
 * card enquanto rola, o que dá profundidade sem custo de layout.
 *
 * O `view-transition-name` é o mesmo usado no hero da página de detalhe —
 * o navegador interpola a imagem de um lugar para o outro na navegação.
 */

const props = withDefaults(defineProps<{
  project: Project
  /** Índice na grade — controla o atraso do reveal. */
  index?: number
  ratio?: string
}>(), {
  index: 0,
  ratio: '4/5',
})

const { cursorOn } = useCursor()

const root = ref<HTMLElement | null>(null)
const progress = useElementProgress(root)

// -6% a +6% de deslocamento vertical da mídia ao longo da passagem pela tela.
const mediaStyle = computed(() => ({
  transform: `translate3d(0, ${(progress.value - 0.5) * -12}%, 0) scale(1.14)`,
}))

const slug = computed(() => projectSlug(props.project))
</script>

<template>
  <NuxtLink
    :to="project.path"
    class="group block"
    v-bind="cursorOn('view', 'Ver')"
  >
    <div
      ref="root"
      v-reveal="{ delay: (index % 2) * 120 }"
      class="reveal-clip relative overflow-hidden rounded-xl bg-smoke"
      :style="{ aspectRatio: ratio, viewTransitionName: `project-${slug}` }"
    >
      <div class="absolute inset-0 will-change-transform" :style="mediaStyle">
        <UiMedia :media="project.cover" sizes="sm:100vw md:50vw lg:45vw" class="h-full w-full" />
      </div>

      <!-- Véu que clareia no hover -->
      <div class="absolute inset-0 bg-void/25 transition-opacity duration-700 group-hover:opacity-0" />

      <span class="absolute left-4 top-4 rounded-full bg-void/60 px-3 py-1.5 text-[11px] tracking-wide text-bone backdrop-blur-md">
        {{ project.category }}
      </span>
    </div>

    <div v-reveal class="reveal mt-5 flex items-start justify-between gap-6">
      <div class="flex flex-col gap-1.5">
        <h3 class="text-[clamp(1.25rem,2vw,1.65rem)] leading-tight transition-colors duration-500 group-hover:text-brass">
          {{ project.title }}
        </h3>
        <p class="text-sm text-linen/50">
          {{ project.subtitle }}
        </p>
      </div>

      <span class="shrink-0 pt-1 text-xs text-stone tabular-nums">
        {{ project.location }} · {{ project.year }}
      </span>
    </div>
  </NuxtLink>
</template>
