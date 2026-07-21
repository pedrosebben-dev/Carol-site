<script setup lang="ts">
/**
 * Botão magnético: dentro de um raio, ele é atraído pelo ponteiro e volta
 * elasticamente ao sair. O rótulo tem duas cópias empilhadas — no hover a
 * de baixo sobe e a de cima sai, um "roll" que parece caro e custa 0 JS extra.
 */

const props = withDefaults(defineProps<{
  to?: string
  href?: string
  variant?: 'solid' | 'outline' | 'ghost'
  /** Intensidade da atração magnética; 0 desliga. */
  magnet?: number
}>(), {
  variant: 'solid',
  magnet: 0.35,
})

const root = ref<HTMLElement | null>(null)
const inner = ref<HTMLElement | null>(null)

const onMove = (e: PointerEvent) => {
  if (!props.magnet || !root.value || !inner.value) return
  const rect = root.value.getBoundingClientRect()
  const x = e.clientX - (rect.left + rect.width / 2)
  const y = e.clientY - (rect.top + rect.height / 2)
  root.value.style.transform = `translate3d(${x * props.magnet}px, ${y * props.magnet}px, 0)`
  inner.value.style.transform = `translate3d(${x * props.magnet * 0.4}px, ${y * props.magnet * 0.4}px, 0)`
}

const onLeave = () => {
  if (!root.value || !inner.value) return
  root.value.style.transform = ''
  inner.value.style.transform = ''
}

const tag = computed(() => (props.href ? 'a' : props.to ? resolveComponent('NuxtLink') : 'button'))

const classes = computed(() => {
  const base = 'group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-7 py-4 text-sm font-medium tracking-wide transition-colors duration-500'
  switch (props.variant) {
    case 'outline':
      return `${base} border border-linen/30 text-bone hover:border-brass hover:text-brass`
    case 'ghost':
      return `${base} px-0 text-bone hover:text-brass`
    default:
      return `${base} bg-bone text-void hover:bg-brass`
  }
})
</script>

<template>
  <span
    ref="root"
    class="inline-block transition-transform duration-500 ease-out-back will-change-transform"
    @pointermove="onMove"
    @pointerleave="onLeave"
  >
    <component
      :is="tag"
      ref="inner"
      :to="to"
      :href="href"
      :target="href ? '_blank' : undefined"
      :rel="href ? 'noopener noreferrer' : undefined"
      :class="classes"
      class="transition-transform duration-500 ease-out-back will-change-transform"
    >
      <!-- Rótulo com roll vertical -->
      <span class="relative block overflow-hidden">
        <span class="block transition-transform duration-500 ease-out-expo group-hover:-translate-y-full">
          <slot />
        </span>
        <span class="absolute inset-0 block translate-y-full transition-transform duration-500 ease-out-expo group-hover:translate-y-0">
          <slot />
        </span>
      </span>

      <svg
        class="h-3.5 w-3.5 shrink-0 transition-transform duration-500 ease-out-expo group-hover:translate-x-1"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
      >
        <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </component>
  </span>
</template>
