<script setup lang="ts">
/** Fio de progresso no topo da página. */
const { scrollProgress } = useScrollState()
</script>

<template>
  <div class="pointer-events-none fixed inset-x-0 top-0 z-[150] h-px bg-line/50">
    <div
      class="h-full origin-left bg-brass"
      :style="{ transform: `scaleX(${scrollProgress})` }"
    />
  </div>
</template>
