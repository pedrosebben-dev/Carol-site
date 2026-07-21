<script setup lang="ts">
/**
 * Preloader curto (~1s). Conta até 100, depois duas cortinas abrem
 * verticalmente. Roda só uma vez por sessão — voltar pra home não repete.
 */

const done = ref(false)
const count = ref(0)
const leaving = ref(false)

const SESSION_KEY = 'carolinadill:intro-seen'

onMounted(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const seen = sessionStorage.getItem(SESSION_KEY) === '1'

  if (reduced || seen) {
    done.value = true
    return
  }

  document.body.dataset.locked = 'true'

  const start = performance.now()
  const DURATION = 1000

  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / DURATION)
    // Ease out: acelera no começo e "assenta" nos últimos números.
    count.value = Math.round((1 - (1 - t) ** 3) * 100)
    if (t < 1) {
      requestAnimationFrame(tick)
    }
    else {
      leaving.value = true
      sessionStorage.setItem(SESSION_KEY, '1')
      setTimeout(() => {
        done.value = true
        delete document.body.dataset.locked
      }, 900)
    }
  }

  requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  delete document.body.dataset.locked
})
</script>

<template>
  <ClientOnly>
    <div
      v-if="!done"
      class="fixed inset-0 z-[300] flex items-end justify-between overflow-hidden px-[clamp(1.25rem,5vw,5rem)] pb-[clamp(1.5rem,5vh,4rem)]"
    >
      <!-- Cortinas -->
      <div
        class="absolute inset-x-0 top-0 h-1/2 bg-void transition-transform duration-[900ms] ease-in-out-expo"
        :class="leaving ? '-translate-y-full' : 'translate-y-0'"
      />
      <div
        class="absolute inset-x-0 bottom-0 h-1/2 bg-void transition-transform duration-[900ms] ease-in-out-expo"
        :class="leaving ? 'translate-y-full' : 'translate-y-0'"
      />

      <span
        class="relative font-brand text-gold text-[clamp(1.15rem,2.2vw,1.65rem)] font-medium tracking-[0.02em] transition-opacity duration-300"
        :class="leaving ? 'opacity-0' : 'opacity-100'"
      >Carolina Dill</span>

      <span
        class="relative font-display text-[clamp(3rem,12vw,10rem)] leading-none tabular-nums text-bone transition-opacity duration-300"
        :class="leaving ? 'opacity-0' : 'opacity-100'"
      >{{ count }}</span>
    </div>
  </ClientOnly>
</template>
