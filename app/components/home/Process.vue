<script setup lang="ts">
import { process } from '~/data/home'

/**
 * Etapas com a coluna esquerda sticky: o título fica parado enquanto os
 * passos passam ao lado. Em telas pequenas vira lista normal empilhada.
 */
</script>

<template>
  <section id="processo" class="container-x py-section">
    <div class="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
      <div class="lg:sticky lg:top-32 lg:self-start">
        <UiSectionHead
          index="03"
          label="Processo"
          title="Quatro etapas, nenhuma surpresa."
          lead="Você sabe exatamente o que recebe e quando recebe, desde a primeira conversa."
        />
      </div>

      <ol class="flex flex-col">
        <li
          v-for="(item, i) in process"
          :key="item.step"
          v-reveal="{ delay: i * 100 }"
          class="reveal group relative border-t border-line/60 py-9 last:border-b"
        >
          <div class="flex gap-6 lg:gap-10">
            <span class="font-display text-2xl leading-none text-brass tabular-nums">
              {{ item.step }}
            </span>
            <div class="flex flex-col gap-3">
              <h3 class="text-[clamp(1.3rem,2.4vw,1.9rem)] leading-tight">
                {{ item.title }}
              </h3>
              <p class="max-w-[48ch] text-linen/60">
                {{ item.description }}
              </p>
            </div>
          </div>

          <!-- Linha que preenche no hover -->
          <span class="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-brass transition-transform duration-700 ease-out-expo group-hover:scale-x-100" />
        </li>
      </ol>
    </div>
  </section>
</template>
