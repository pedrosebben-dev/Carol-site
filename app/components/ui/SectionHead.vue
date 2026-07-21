<script setup lang="ts">
/** Cabeçalho padrão de seção: número + rótulo + título com máscara de linha. */
defineProps<{
  index?: string
  label: string
  title: string
  lead?: string
  align?: 'left' | 'center'
}>()
</script>

<template>
  <header
    v-reveal
    class="reveal flex flex-col gap-6"
    :class="align === 'center' ? 'items-center text-center' : 'items-start'"
  >
    <div class="flex items-center gap-4 text-brass">
      <span v-if="index" class="eyebrow tabular-nums">{{ index }}</span>
      <span class="h-px w-10 bg-brass/50" />
      <span class="eyebrow text-linen/70">{{ label }}</span>
    </div>

    <h2 class="text-title max-w-[18ch]" :class="align === 'center' && 'mx-auto'">
      <span class="line-mask"><span>{{ title }}</span></span>
    </h2>

    <p
      v-if="lead"
      class="text-lead max-w-[52ch] text-linen/65"
      :class="align === 'center' && 'mx-auto'"
    >
      {{ lead }}
    </p>
  </header>
</template>
