<script setup lang="ts">
import { stats } from '~/data/home'

/**
 * Contadores que só começam a rodar quando a seção entra na tela,
 * com easing (não é um incremento linear — o número "assenta" no final).
 */

const root = ref<HTMLElement | null>(null)
const values = ref<number[]>(stats.map(() => 0))

const { stop } = useIntersectionObserver(
  root,
  ([entry]) => {
    if (!entry?.isIntersecting) return
    stop()

    const DURATION = 1600
    const start = performance.now()

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION)
      const eased = 1 - (1 - t) ** 4
      values.value = stats.map(s => Math.round(s.value * eased))
      if (t < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  },
  { threshold: 0.35 },
)

onBeforeUnmount(stop)
</script>

<template>
  <section ref="root" class="border-y border-line/60 bg-ink">
    <div class="container-x grid gap-px bg-line/40 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="(stat, i) in stats"
        :key="stat.label"
        class="flex flex-col gap-3 bg-ink px-2 py-[clamp(2.5rem,5vw,4rem)]"
      >
        <span class="font-display text-[clamp(3rem,6vw,5rem)] leading-none tabular-nums text-bone">
          {{ values[i] }}<span class="text-brass">{{ stat.suffix }}</span>
        </span>
        <span class="eyebrow text-linen/50">{{ stat.label }}</span>
      </div>
    </div>
  </section>
</template>
