<script setup lang="ts">
/**
 * Faixa infinita cuja velocidade e inclinação reagem ao scroll.
 * Rolar rápido "puxa" o texto — detalhe pequeno que faz a página parecer viva.
 */

const props = withDefaults(defineProps<{
  text: string
  /** Segundos para uma volta completa em repouso. */
  speed?: number
  reverse?: boolean
}>(), {
  speed: 26,
  reverse: false,
})

const { velocity } = useScrollState()

// Velocidade do Lenis chega em px/frame; normaliza para um fator suave.
const skew = computed(() => Math.max(-8, Math.min(8, velocity.value * 0.25)))
// "Puxão" do scroll bem mais contido: acelera no máximo ~2× (antes 4×) e com
// rampa mais suave, pra dar pra ler o texto enquanto rola.
const boost = computed(() => 1 + Math.min(1, Math.abs(velocity.value) * 0.015))

const items = computed(() => Array.from({ length: 8 }, () => props.text))
</script>

<template>
  <div
    class="relative flex overflow-hidden border-y border-line/60 py-[clamp(1rem,2.5vw,2rem)] select-none"
    :style="{ transform: `skewY(${skew * 0.12}deg)` }"
  >
    <div
      class="flex shrink-0 items-center gap-[clamp(1.5rem,4vw,4rem)] pr-[clamp(1.5rem,4vw,4rem)] will-change-transform"
      :style="{
        animation: `marquee-x ${speed}s linear infinite`,
        animationDirection: reverse ? 'reverse' : 'normal',
        animationDuration: `${speed / boost}s`,
      }"
    >
      <template v-for="(item, i) in items" :key="`a-${i}`">
        <span class="font-display text-[clamp(1.75rem,5vw,4.5rem)] leading-none whitespace-nowrap text-bone/85">
          {{ item }}
        </span>
        <span class="h-2 w-2 shrink-0 rounded-full bg-brass" />
      </template>
      <!-- Segunda cópia: a animação move -50%, então o loop é imperceptível. -->
      <template v-for="(item, i) in items" :key="`b-${i}`">
        <span class="font-display text-[clamp(1.75rem,5vw,4.5rem)] leading-none whitespace-nowrap text-bone/85">
          {{ item }}
        </span>
        <span class="h-2 w-2 shrink-0 rounded-full bg-brass" />
      </template>
    </div>
  </div>
</template>
