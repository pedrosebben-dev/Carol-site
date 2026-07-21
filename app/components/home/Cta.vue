<script setup lang="ts">
const { whatsappLink, site } = useSite()

const root = ref<HTMLElement | null>(null)
const progress = useElementProgress(root)

// A imagem de fundo "abre" verticalmente conforme a seção entra na tela.
const clipStyle = computed(() => {
  const inset = Math.max(0, 22 - progress.value * 44)
  return { clipPath: `inset(${inset}% 0% ${inset}% 0% round 1.5rem)` }
})
</script>

<template>
  <section ref="root" class="container-x pb-section pt-[clamp(3rem,6vw,6rem)]">
    <div class="relative overflow-hidden rounded-3xl">
      <div class="absolute inset-0 transition-[clip-path] duration-300" :style="clipStyle">
        <NuxtImg
          src="/media/cta/ambiente.jpg"
          alt=""
          sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw"
          loading="lazy"
          class="h-full w-full scale-105 object-cover"
        />
        <div class="absolute inset-0 bg-void/70" />
      </div>

      <div class="relative flex flex-col items-center gap-8 px-6 py-[clamp(4rem,10vw,8rem)] text-center">
        <p v-reveal class="reveal eyebrow text-brass">
          Vamos começar
        </p>

        <h2 v-reveal="{ delay: 120 }" class="reveal text-display max-w-[16ch]">
          Seu projeto começa com uma conversa de 40 minutos.
        </h2>

        <p v-reveal="{ delay: 200 }" class="reveal text-lead max-w-[48ch] text-linen/65">
          Sem compromisso e sem custo. Você sai dela com escopo, prazo e uma
          proposta na mão.
        </p>

        <div v-reveal="{ delay: 280 }" class="reveal flex flex-wrap justify-center gap-4">
          <UiButton :href="whatsappLink()">
            Falar no WhatsApp
          </UiButton>
          <UiButton :href="`mailto:${site.email}`" variant="outline">
            Enviar e-mail
          </UiButton>
        </div>
      </div>
    </div>
  </section>
</template>
