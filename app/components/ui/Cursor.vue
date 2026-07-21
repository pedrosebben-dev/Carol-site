<script setup lang="ts">
/**
 * Cursor customizado: um ponto que gruda no ponteiro e um anel que persegue
 * com atraso. Sobre mídia ele cresce e mostra um rótulo ("Ver projeto",
 * "Arraste"). Só liga em dispositivos com ponteiro fino — em touch, nada.
 */

const { variant, label, enabled } = useCursor()

const dot = ref<HTMLElement | null>(null)
const ring = ref<HTMLElement | null>(null)

let raf = 0
const pointer = { x: 0, y: 0 }
const ringPos = { x: 0, y: 0 }

const onMove = (e: PointerEvent) => {
  pointer.x = e.clientX
  pointer.y = e.clientY
  if (!enabled.value) {
    enabled.value = true
    document.body.dataset.cursor = 'on'
  }
}

const tick = () => {
  // Lerp: o anel chega em ~12% da distância por frame -> atraso elástico.
  ringPos.x += (pointer.x - ringPos.x) * 0.12
  ringPos.y += (pointer.y - ringPos.y) * 0.12

  if (dot.value) {
    dot.value.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0) translate(-50%, -50%)`
  }
  if (ring.value) {
    ring.value.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`
  }

  raf = requestAnimationFrame(tick)
}

onMounted(() => {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!fine || reduced) return

  window.addEventListener('pointermove', onMove, { passive: true })
  raf = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('pointermove', onMove)
  delete document.body.dataset.cursor
})

const ringSize = computed(() => {
  switch (variant.value) {
    case 'view': return 88
    case 'play': return 72
    case 'drag': return 76
    case 'hidden': return 0
    default: return 34
  }
})
</script>

<template>
  <ClientOnly>
    <div v-if="enabled" class="pointer-events-none fixed inset-0 z-[200]" aria-hidden="true">
      <!-- Anel elástico -->
      <div
        ref="ring"
        class="fixed left-0 top-0 flex items-center justify-center rounded-full border border-bone/40 backdrop-invert-[0.08] transition-[width,height,background-color,border-color] duration-400 ease-out-expo"
        :class="variant !== 'default' ? 'bg-brass/90 border-brass/0' : 'bg-transparent'"
        :style="{ width: `${ringSize}px`, height: `${ringSize}px` }"
      >
        <span
          class="text-[10px] font-medium uppercase tracking-[0.14em] text-void transition-opacity duration-300"
          :class="label ? 'opacity-100' : 'opacity-0'"
        >{{ label }}</span>
      </div>

      <!-- Ponto que gruda -->
      <div
        ref="dot"
        class="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-bone transition-opacity duration-300"
        :class="variant === 'default' ? 'opacity-100' : 'opacity-0'"
      />
    </div>
  </ClientOnly>
</template>
