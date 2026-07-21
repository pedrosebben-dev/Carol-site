<script setup lang="ts">
import { faq } from '~/data/home'

/**
 * Acordeão acessível construído com <details>/<summary> — teclado, leitor de
 * tela e busca do navegador funcionam de graça. A animação de altura usa
 * grid-template-rows (0fr -> 1fr), que anima sem precisar medir o conteúdo.
 */

const open = ref<number | null>(0)

function toggle(i: number) {
  open.value = open.value === i ? null : i
}
</script>

<template>
  <section id="faq" class="container-x py-section">
    <div class="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
      <div class="lg:sticky lg:top-32 lg:self-start">
        <UiSectionHead
          index="07"
          label="Dúvidas"
          title="As perguntas que sempre aparecem."
        />
      </div>

      <div class="border-t border-line/60">
        <div
          v-for="(item, i) in faq"
          :key="item.question"
          v-reveal="{ delay: i * 60 }"
          class="reveal border-b border-line/60"
        >
          <h3>
            <button
              class="group flex w-full items-start justify-between gap-6 py-6 text-left"
              :aria-expanded="open === i"
              :aria-controls="`faq-painel-${i}`"
              @click="toggle(i)"
            >
              <span
                class="text-[clamp(1.05rem,1.9vw,1.4rem)] leading-snug transition-colors duration-400"
                :class="open === i ? 'text-brass' : 'text-bone group-hover:text-linen'"
              >
                {{ item.question }}
              </span>

              <span class="relative mt-2 h-3.5 w-3.5 shrink-0">
                <span class="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
                <span
                  class="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current transition-transform duration-500 ease-out-expo"
                  :class="open === i ? 'scale-y-0' : 'scale-y-100'"
                />
              </span>
            </button>
          </h3>

          <div
            :id="`faq-painel-${i}`"
            class="grid transition-[grid-template-rows] duration-600 ease-out-expo"
            :class="open === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
          >
            <div class="overflow-hidden">
              <p class="max-w-[62ch] pb-7 pr-10 text-linen/60">
                {{ item.answer }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
