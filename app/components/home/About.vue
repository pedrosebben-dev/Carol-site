<script setup lang="ts">
/**
 * Sobre: imagem sticky à esquerda com parallax, texto rolando à direita.
 */

const root = ref<HTMLElement | null>(null)
const progress = useElementProgress(root)

const imageStyle = computed(() => ({
  transform: `translate3d(0, ${(progress.value - 0.5) * -10}%, 0) scale(1.12)`,
}))
</script>

<template>
  <section id="sobre" ref="root" class="container-x py-section">
    <div class="grid gap-14 lg:grid-cols-2 lg:gap-20">
      <div class="lg:sticky lg:top-28 lg:self-start">
        <div
          v-reveal
          class="reveal-clip relative aspect-4/5 overflow-hidden rounded-2xl bg-smoke"
        >
          <div class="absolute inset-0 will-change-transform" :style="imageStyle">
            <NuxtImg
              src="/media/sobre/estudio.jpg"
              alt="Mesa de trabalho do estúdio com amostras de tecido, madeira e pedra"
              sizes="sm:100vw lg:45vw"
              loading="lazy"
              class="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-8">
        <UiSectionHead
          index="05"
          label="Sobre"
          title="Um estúdio pequeno, de propósito."
        />

        <div class="flex flex-col gap-6 text-lead text-linen/65">
          <p v-reveal class="reveal">
            Trabalhamos com poucos projetos por vez porque interiores bem resolvidos
            exigem tempo de convivência com o problema. Antes de desenhar qualquer
            coisa, passamos horas entendendo como você usa o espaço — onde a luz bate
            de manhã, onde a bagunça se acumula, o que você nunca usa.
          </p>
          <p v-reveal="{ delay: 120 }" class="reveal">
            O resultado é um projeto que não parece catálogo. Materiais naturais,
            marcenaria desenhada peça por peça e uma paleta que envelhece bem —
            nada que precise ser trocado quando a tendência virar.
          </p>
          <p v-reveal="{ delay: 200 }" class="reveal">
            Cuidamos da obra do início ao fim. Você aprova o render, a gente cota com
            fornecedores, acompanha a execução e entrega o ambiente montado. Sua parte
            é decidir; a nossa é fazer acontecer.
          </p>
        </div>

        <dl v-reveal="{ delay: 280 }" class="reveal mt-4 grid grid-cols-2 gap-px bg-line/50 sm:grid-cols-3">
          <div class="flex flex-col gap-1.5 bg-void p-5">
            <dt class="eyebrow text-brass">
              Fundação
            </dt>
            <dd class="text-lg">
              2017
            </dd>
          </div>
          <div class="flex flex-col gap-1.5 bg-void p-5">
            <dt class="eyebrow text-brass">
              Equipe
            </dt>
            <dd class="text-lg">
              4 pessoas
            </dd>
          </div>
          <div class="flex flex-col gap-1.5 bg-void p-5">
            <dt class="eyebrow text-brass">
              Atendimento
            </dt>
            <dd class="text-lg">
              Brasil e exterior
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>
