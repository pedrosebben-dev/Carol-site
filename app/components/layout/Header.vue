<script setup lang="ts">
/**
 * Header que se esconde ao descer e reaparece ao subir, com fundo em
 * blur só depois que sai do hero. Menu mobile em tela cheia com os itens
 * entrando em cascata.
 */

const { site, whatsappLink } = useSite()
const { scrollY, direction } = useScrollState()
const { $scrollTo } = useNuxtApp() as unknown as {
  $scrollTo?: (t: string | number | HTMLElement, o?: number) => void
}

const open = ref(false)
const route = useRoute()

const solid = computed(() => scrollY.value > 80)
const hidden = computed(() => direction.value === 1 && scrollY.value > 420 && !open.value)

watch(() => route.fullPath, () => {
  open.value = false
})

watch(open, (v) => {
  if (import.meta.client) {
    document.body.dataset.locked = v ? 'true' : 'false'
    if (!v) delete document.body.dataset.locked
  }
})

/** Âncoras na home usam scroll suave; rotas normais seguem o router. */
function onNavClick(e: MouseEvent, to: string) {
  if (!to.includes('#')) return
  const hash = `#${to.split('#')[1]}`
  if (route.path === '/') {
    e.preventDefault()
    open.value = false
    const el = document.querySelector(hash)
    if (el instanceof HTMLElement) {
      $scrollTo ? $scrollTo(el, -40) : el.scrollIntoView({ behavior: 'smooth' })
    }
  }
}
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-[120] transition-transform duration-700 ease-out-expo"
    :class="hidden ? '-translate-y-full' : 'translate-y-0'"
  >
    <div
      class="transition-colors duration-500"
      :class="solid && !open ? 'bg-void/70 backdrop-blur-xl border-b border-line/50' : 'bg-transparent'"
    >
      <div class="container-x flex items-center justify-between py-5">
        <NuxtLink
          to="/"
          class="group flex items-baseline gap-2.5"
          :aria-label="`${site.legalName} — início`"
        >
          <span class="font-display text-xl leading-none text-bone">{{ site.name }}</span>
          <span class="eyebrow hidden text-linen/45 transition-colors group-hover:text-brass sm:block">
            {{ site.tagline }}
          </span>
        </NuxtLink>

        <!-- Desktop -->
        <nav class="hidden items-center gap-8 lg:flex" aria-label="Principal">
          <NuxtLink
            v-for="item in site.nav"
            :key="item.to"
            :to="item.to"
            class="link-underline text-sm text-linen/75 transition-colors hover:text-bone"
            @click="onNavClick($event, item.to)"
          >
            {{ item.label }}
          </NuxtLink>

          <UiButton :href="whatsappLink()" variant="outline" :magnet="0.25">
            Falar no WhatsApp
          </UiButton>
        </nav>

        <!-- Toggle mobile -->
        <button
          class="relative z-10 flex h-10 w-10 flex-col items-center justify-center gap-[5px] lg:hidden"
          :aria-expanded="open"
          aria-controls="menu-mobile"
          :aria-label="open ? 'Fechar menu' : 'Abrir menu'"
          @click="open = !open"
        >
          <span
            class="block h-px w-6 bg-bone transition-transform duration-400 ease-out-expo"
            :class="open && 'translate-y-[3px] rotate-45'"
          />
          <span
            class="block h-px w-6 bg-bone transition-transform duration-400 ease-out-expo"
            :class="open && '-translate-y-[3px] -rotate-45'"
          />
        </button>
      </div>
    </div>

    <!-- Menu mobile em tela cheia -->
    <Transition
      enter-active-class="transition-[clip-path] duration-700 ease-out-expo"
      enter-from-class="[clip-path:inset(0_0_100%_0)]"
      enter-to-class="[clip-path:inset(0_0_0_0)]"
      leave-active-class="transition-[clip-path] duration-500 ease-in-out-expo"
      leave-from-class="[clip-path:inset(0_0_0_0)]"
      leave-to-class="[clip-path:inset(0_0_100%_0)]"
    >
      <div
        v-if="open"
        id="menu-mobile"
        class="fixed inset-0 -z-10 flex flex-col justify-between bg-ink px-[clamp(1.25rem,5vw,5rem)] pb-12 pt-28 lg:hidden"
      >
        <nav class="flex flex-col gap-1" aria-label="Principal (mobile)">
          <NuxtLink
            v-for="(item, i) in site.nav"
            :key="item.to"
            :to="item.to"
            class="overflow-hidden border-b border-line/60 py-4"
            :style="{ transitionDelay: `${120 + i * 70}ms` }"
            @click="onNavClick($event, item.to)"
          >
            <span class="flex items-baseline justify-between">
              <span class="font-display text-[clamp(2rem,10vw,3.5rem)] leading-none text-bone">
                {{ item.label }}
              </span>
              <span class="eyebrow text-brass">0{{ i + 1 }}</span>
            </span>
          </NuxtLink>
        </nav>

        <div class="flex flex-col gap-6">
          <UiButton :href="whatsappLink()" variant="solid" :magnet="0">
            Falar no WhatsApp
          </UiButton>
          <div class="flex gap-5">
            <a
              v-for="s in site.social"
              :key="s.href"
              :href="s.href"
              target="_blank"
              rel="noopener noreferrer"
              class="eyebrow text-linen/60 transition-colors hover:text-brass"
            >{{ s.label }}</a>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>
