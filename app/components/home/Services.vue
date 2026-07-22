<script setup lang="ts">
import { services } from '~/data/home'

/**
 * Lista de serviços onde o hover revela uma prévia que segue o cursor.
 * É o padrão de agência: a lista fica limpa, a imagem só aparece na intenção.
 *
 * A imagem é posicionada por transform em rAF (nunca por `top/left`, que
 * forçaria layout a cada frame) e persegue o ponteiro com lerp.
 */

const active = ref<number | null>(null)
const preview = ref<HTMLElement | null>(null)
const section = ref<HTMLElement | null>(null)

let raf = 0
const target = { x: 0, y: 0 }
const current = { x: 0, y: 0 }

const onMove = (e: PointerEvent) => {
  const rect = section.value?.getBoundingClientRect()
  if (!rect) return
  target.x = e.clientX - rect.left
  target.y = e.clientY - rect.top
}

const tick = () => {
  current.x += (target.x - current.x) * 0.14
  current.y += (target.y - current.y) * 0.14
  if (preview.value) {
    preview.value.style.transform =
      `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`
  }
  raf = requestAnimationFrame(tick)
}

onMounted(() => {
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    raf = requestAnimationFrame(tick)
  }
})

onBeforeUnmount(() => cancelAnimationFrame(raf))
</script>

<template>
  <section
    id="servicos"
    ref="section"
    class="relative py-section"
    @pointermove="onMove"
  >
    <div class="container-x">
      <UiSectionHead
        index="02"
        label="Serviços"
        title="O que entra no projeto."
        lead="Contrate o pacote fechado ou apenas a peça que está faltando."
      />

      <ul class="mt-16 border-t border-line/60">
        <li v-for="(service, i) in services" :key="service.title">
          <NuxtLink
            :to="`/servicos/${service.slug}`"
            v-reveal="{ delay: i * 60 }"
            class="reveal group relative flex cursor-pointer items-center justify-between gap-8 border-b border-line/60 py-8 transition-colors duration-500 lg:py-10"
            @pointerenter="active = i"
            @pointerleave="active = null"
          >
            <!-- Preenchimento que sobe no hover -->
            <span
              class="pointer-events-none absolute inset-0 -z-10 origin-bottom bg-smoke transition-transform duration-600 ease-out-expo"
              :class="active === i ? 'scale-y-100' : 'scale-y-0'"
            />

            <div class="flex items-baseline gap-6 pl-0 transition-[padding] duration-600 ease-out-expo lg:group-hover:pl-8">
              <span class="eyebrow shrink-0 text-brass tabular-nums">0{{ i + 1 }}</span>
              <div class="flex flex-col gap-2">
                <h3 class="text-[clamp(1.35rem,3vw,2.25rem)] leading-tight transition-colors duration-500 group-hover:text-brass">
                  {{ service.title }}
                </h3>
                <p class="max-w-[54ch] text-sm text-linen/55 lg:text-base">
                  {{ service.description }}
                </p>
              </div>
            </div>

            <svg
              class="h-5 w-5 shrink-0 text-linen/30 transition-all duration-600 ease-out-expo group-hover:translate-x-2 group-hover:text-brass"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path d="M4 16 16 4M7 4h9v9" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </NuxtLink>
        </li>
      </ul>
    </div>

    <!-- Prévia que segue o cursor (desktop) -->
    <div
      ref="preview"
      class="pointer-events-none absolute left-0 top-0 z-10 hidden aspect-4/5 w-[clamp(14rem,18vw,20rem)] overflow-hidden rounded-xl transition-[opacity,scale] duration-500 ease-out-expo lg:block"
      :class="active !== null ? 'scale-100 opacity-100' : 'scale-90 opacity-0'"
      aria-hidden="true"
    >
      <div
        v-for="(service, i) in services"
        :key="service.title"
        class="absolute inset-0 transition-opacity duration-400"
        :class="active === i ? 'opacity-100' : 'opacity-0'"
      >
        <NuxtImg
          :src="service.media"
          alt=""
          sizes="320px"
          loading="lazy"
          class="h-full w-full object-cover"
        />
      </div>
    </div>
  </section>
</template>
