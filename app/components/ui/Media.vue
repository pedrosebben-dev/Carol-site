<script setup lang="ts">
/**
 * Imagem ou vídeo, mesma API.
 *
 * O markdown do projeto só declara `type: video` e o componente cuida do
 * resto: autoplay mudo inline, play/pause conforme entra e sai da viewport
 * (não queima bateria com 8 vídeos rodando fora da tela), poster enquanto
 * carrega e fallback estático em prefers-reduced-motion.
 */

interface MediaItem {
  type?: 'image' | 'video'
  src: string
  srcWebm?: string
  poster?: string
  alt: string
}

/**
 * Mídia que ocupa a largura toda da tela.
 *
 * Precisa ser escrito com breakpoint em cada faixa: o @nuxt/image v2 não
 * entende um `sizes="100vw"` solto e gera um srcset inútil de 1w/2w.
 * Com as chaves explícitas ele produz as larguras certas.
 */
const FULL_BLEED = 'xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw'

const props = withDefaults(defineProps<{
  media: MediaItem
  /** Proporção CSS, ex.: '4/5'. Omitir deixa a mídia preencher o pai. */
  ratio?: string
  sizes?: string
  eager?: boolean
  /** Escala aplicada por efeitos de scroll do componente pai. */
  scale?: number
}>(), {
  sizes: FULL_BLEED,
  eager: false,
  scale: 1,
})

const isVideo = computed(() => props.media.type === 'video')

const root = ref<HTMLElement | null>(null)
const videoEl = ref<HTMLVideoElement | null>(null)
const loaded = ref(false)

// Só toca o vídeo quando ele está de fato visível.
const { stop } = useIntersectionObserver(
  root,
  ([entry]) => {
    const v = videoEl.value
    if (!v || !entry) return
    if (entry.isIntersecting) {
      v.play().catch(() => {
        // Autoplay bloqueado pelo navegador: o poster continua lá, tudo bem.
      })
    }
    else {
      v.pause()
    }
  },
  { threshold: 0.15 },
)

onBeforeUnmount(stop)
</script>

<template>
  <div
    ref="root"
    class="relative overflow-hidden bg-smoke"
    :style="{ aspectRatio: ratio }"
  >
    <video
      v-if="isVideo"
      ref="videoEl"
      class="h-full w-full object-cover transition-[transform,opacity] duration-700"
      :class="loaded ? 'opacity-100' : 'opacity-0'"
      :style="{ transform: `scale(${scale})` }"
      :poster="media.poster"
      :aria-label="media.alt"
      muted
      loop
      playsinline
      disablepictureinpicture
      :preload="eager ? 'auto' : 'metadata'"
      @loadeddata="loaded = true"
    >
      <source v-if="media.srcWebm" :src="media.srcWebm" type="video/webm">
      <source :src="media.src" type="video/mp4">
    </video>

    <NuxtImg
      v-else
      :src="media.src"
      :alt="media.alt"
      :sizes="sizes"
      :loading="eager ? 'eager' : 'lazy'"
      :fetchpriority="eager ? 'high' : 'auto'"
      class="h-full w-full object-cover transition-[transform,opacity] duration-700"
      :class="loaded ? 'opacity-100' : 'opacity-0'"
      :style="{ transform: `scale(${scale})` }"
      @load="loaded = true"
    />

    <!-- Placeholder enquanto carrega: evita flash branco no fundo escuro. -->
    <div
      v-show="!loaded"
      class="absolute inset-0 animate-pulse bg-ash"
      aria-hidden="true"
    />
  </div>
</template>
