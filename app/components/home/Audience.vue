<script setup lang="ts">
import { audience } from '~/data/home'

const { whatsappLink } = useSite()
</script>

<template>
  <section id="para-quem" class="container-x py-section">
    <UiSectionHead
      index="01"
      label="Para quem é"
      title="Três formas de trabalhar juntos."
      lead="Do projeto completo à consultoria pontual — o escopo se ajusta ao momento do seu imóvel, não o contrário."
    />

    <div class="mt-16 grid gap-px overflow-hidden rounded-2xl bg-line/60 lg:grid-cols-3">
      <article
        v-for="(item, i) in audience"
        :key="item.index"
        v-reveal="{ delay: i * 120 }"
        class="reveal group relative flex flex-col gap-6 bg-ink p-8 transition-colors duration-700 hover:bg-smoke lg:p-10"
      >
        <span class="font-display text-6xl leading-none text-line transition-colors duration-700 group-hover:text-brass/60">
          {{ item.index }}
        </span>

        <h3 class="text-[1.6rem] leading-tight">
          {{ item.title }}
        </h3>

        <p class="text-linen/60">
          {{ item.description }}
        </p>

        <ul class="mt-auto flex flex-wrap gap-2 pt-4">
          <li
            v-for="tag in item.tags"
            :key="tag"
            class="rounded-full border border-line px-3 py-1.5 text-xs text-linen/55"
          >
            {{ tag }}
          </li>
        </ul>

        <a
          :href="whatsappLink(item.wa)"
          target="_blank"
          rel="noopener noreferrer"
          class="link-underline w-fit text-sm text-brass"
        >
          Conversar sobre isso
        </a>
      </article>
    </div>
  </section>
</template>
