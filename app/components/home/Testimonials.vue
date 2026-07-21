<script setup lang="ts">
import { testimonials } from '~/data/home'

/**
 * Depoimentos em carrossel controlado por teclado, arraste e botões.
 * Sem biblioteca: scroll-snap nativo faz o trabalho pesado.
 */

const track = ref<HTMLElement | null>(null)
const activeIndex = ref(0)
const { cursorOn } = useCursor()

function goTo(i: number) {
  const el = track.value
  if (!el) return
  const clamped = Math.max(0, Math.min(testimonials.length - 1, i))
  const card = el.children[clamped] as HTMLElement | undefined
  card?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
  activeIndex.value = clamped
}

// Descobre qual card está mais centralizado enquanto o usuário arrasta.
function onScroll() {
  const el = track.value
  if (!el) return
  const center = el.scrollLeft + el.clientWidth / 2
  let best = 0
  let bestDist = Number.POSITIVE_INFINITY
  Array.from(el.children).forEach((child, i) => {
    const c = child as HTMLElement
    const dist = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center)
    if (dist < bestDist) {
      bestDist = dist
      best = i
    }
  })
  activeIndex.value = best
}
</script>

<template>
  <section class="py-section">
    <div class="container-x">
      <UiSectionHead
        index="06"
        label="Depoimentos"
        title="O que dizem depois da entrega."
      />
    </div>

    <div
      ref="track"
      class="mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto px-[clamp(1.25rem,5vw,5rem)] pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      v-bind="cursorOn('drag', 'Arraste')"
      @scroll.passive="onScroll"
    >
      <figure
        v-for="(item, i) in testimonials"
        :key="item.author"
        v-reveal="{ delay: i * 100 }"
        class="reveal flex w-[min(88vw,34rem)] shrink-0 snap-start flex-col justify-between gap-8 rounded-2xl border border-line/70 bg-ink p-8 lg:p-10"
      >
        <svg class="h-7 w-7 text-brass" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M9.5 5C6.46 5 4 7.46 4 10.5S6.46 16 9.5 16c.35 0 .69-.03 1.02-.1-.6 1.9-2.2 3.3-4.2 3.72V22c4.5-.6 8-4.47 8-9.15V10.5C14.32 7.46 11.86 5 9.5 5Zm10 0C16.46 5 14 7.46 14 10.5S16.46 16 19.5 16c.35 0 .69-.03 1.02-.1-.6 1.9-2.2 3.3-4.2 3.72V22c4.5-.6 8-4.47 8-9.15V10.5C24.32 7.46 21.86 5 19.5 5Z" />
        </svg>

        <blockquote class="text-[clamp(1.05rem,1.6vw,1.35rem)] leading-relaxed text-linen/85">
          “{{ item.quote }}”
        </blockquote>

        <figcaption class="flex flex-col gap-1 border-t border-line/70 pt-5">
          <span class="text-bone">{{ item.author }}</span>
          <span class="text-sm text-linen/45">{{ item.role }}</span>
        </figcaption>
      </figure>
    </div>

    <div class="container-x mt-4 flex items-center gap-4">
      <button
        class="flex h-11 w-11 items-center justify-center rounded-full border border-line transition-colors hover:border-brass hover:text-brass disabled:opacity-30"
        :disabled="activeIndex === 0"
        aria-label="Depoimento anterior"
        @click="goTo(activeIndex - 1)"
      >
        <svg class="h-4 w-4 rotate-180" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <button
        class="flex h-11 w-11 items-center justify-center rounded-full border border-line transition-colors hover:border-brass hover:text-brass disabled:opacity-30"
        :disabled="activeIndex === testimonials.length - 1"
        aria-label="Próximo depoimento"
        @click="goTo(activeIndex + 1)"
      >
        <svg class="h-4 w-4" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <span class="ml-2 text-sm text-stone tabular-nums">
        {{ String(activeIndex + 1).padStart(2, '0') }} / {{ String(testimonials.length).padStart(2, '0') }}
      </span>
    </div>
  </section>
</template>
