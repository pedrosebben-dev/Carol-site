<script setup lang="ts">
import { heroRotatingWords } from '~/data/home'

/**
 * Hero em tela cheia com vídeo de fundo.
 *
 * Dois efeitos scroll-linked: o vídeo sobe mais devagar que a página
 * (parallax) e o conteúdo perde opacidade + sobe conforme sai. Ambos
 * derivam do mesmo `scrollY`, então é um cálculo por frame, não um por efeito.
 */

const { whatsappLink, site } = useSite()
const { scrollY } = useScrollState()

const vh = ref(1000)
onMounted(() => {
  vh.value = window.innerHeight
  useEventListener(window, 'resize', () => {
    vh.value = window.innerHeight
  })
})

/** 0 no topo, 1 quando rolou uma tela inteira. */
const p = computed(() => Math.min(1, scrollY.value / vh.value))

const mediaStyle = computed(() => ({
  transform: `translate3d(0, ${p.value * 18}vh, 0) scale(${1 + p.value * 0.14})`,
}))

const contentStyle = computed(() => ({
  transform: `translate3d(0, ${p.value * -8}vh, 0)`,
  opacity: String(Math.max(0, 1 - p.value * 1.6)),
}))

// Troca de palavra a cada 2.6s.
const wordIndex = ref(0)
let timer: ReturnType<typeof setInterval>

onMounted(() => {
  timer = setInterval(() => {
    wordIndex.value = (wordIndex.value + 1) % heroRotatingWords.length
  }, 2600)
})

onBeforeUnmount(() => clearInterval(timer))

const currentWord = computed(() => heroRotatingWords[wordIndex.value] ?? heroRotatingWords[0])
</script>

<template>
  <section class="relative h-svh min-h-[36rem] w-full overflow-hidden">
    <!-- Mídia de fundo -->
    <div class="absolute inset-0 will-change-transform" :style="mediaStyle">
      <UiMedia
        :media="{
          type: 'video',
          src: '/media/hero/hero.mp4',
          poster: '/media/hero/hero-poster.jpg',
          alt: 'Sala de estar com iluminação natural, madeira clara e tons terrosos',
        }"
        eager
        class="h-full w-full"
      />
      <!-- Gradiente para o texto respirar sem escurecer a imagem toda -->
      <div class="absolute inset-0 bg-gradient-to-t from-void via-void/45 to-void/70" />
    </div>

    <!-- Conteúdo -->
    <div
      class="container-x relative flex h-full flex-col justify-end pb-[clamp(2.5rem,7vh,5rem)] will-change-transform"
      :style="contentStyle"
    >
      <p v-reveal class="reveal eyebrow mb-8 text-brass" :style="{ '--reveal-delay': '200ms' }">
        {{ site.city }} · {{ site.state }} — desde 2017
      </p>

      <h1 class="text-hero font-display max-w-[13ch]">
        <span class="line-mask is-visible"><span :style="{ '--reveal-delay': '300ms' }">Interiores</span></span>
        <!-- A palavra troca dentro de uma máscara: sobe saindo, desce entrando -->
        <span class="line-mask is-visible">
          <span :style="{ '--reveal-delay': '420ms' }" class="relative block h-[1em] overflow-hidden text-brass italic">
            <Transition
              enter-active-class="transition-transform duration-700 ease-out-expo"
              enter-from-class="translate-y-full"
              enter-to-class="translate-y-0"
              leave-active-class="absolute inset-0 transition-transform duration-700 ease-out-expo"
              leave-from-class="translate-y-0"
              leave-to-class="-translate-y-full"
            >
              <span :key="currentWord" class="block">{{ currentWord }}</span>
            </Transition>
          </span>
        </span>
      </h1>

      <div class="mt-10 flex flex-col gap-8 border-t border-linen/15 pt-8 lg:flex-row lg:items-end lg:justify-between">
        <p v-reveal class="reveal text-lead max-w-[46ch] text-linen/70" :style="{ '--reveal-delay': '520ms' }">
          Projetos residenciais e comerciais que começam pela sua rotina e terminam
          com a chave na mão — render, execução e obra acompanhada.
        </p>

        <div v-reveal class="reveal flex flex-wrap items-center gap-4" :style="{ '--reveal-delay': '620ms' }">
          <UiButton to="/projetos">
            Ver projetos
          </UiButton>
          <UiButton :href="whatsappLink()" variant="outline">
            Falar no WhatsApp
          </UiButton>
        </div>
      </div>
    </div>

    <!-- Indicador de scroll -->
    <div
      class="pointer-events-none absolute bottom-6 right-[clamp(1.25rem,5vw,5rem)] hidden flex-col items-center gap-3 lg:flex"
      :style="{ opacity: String(Math.max(0, 1 - p * 3)) }"
    >
      <span class="eyebrow [writing-mode:vertical-rl] text-linen/45">Role</span>
      <span class="relative h-14 w-px overflow-hidden bg-linen/20">
        <span class="absolute inset-x-0 top-0 h-1/2 animate-[reveal-up_1.6s_ease-in-out_infinite] bg-brass" />
      </span>
    </div>
  </section>
</template>
