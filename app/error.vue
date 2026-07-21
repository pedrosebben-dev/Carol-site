<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const is404 = computed(() => props.error?.statusCode === 404)

useHead({ title: is404.value ? 'Página não encontrada' : 'Algo deu errado' })
</script>

<template>
  <div class="grain flex min-h-screen flex-col items-center justify-center gap-8 bg-void px-6 text-center">
    <span class="font-display text-[clamp(5rem,22vw,16rem)] leading-none text-bone/10">
      {{ error?.statusCode || 500 }}
    </span>

    <div class="-mt-[clamp(2rem,8vw,6rem)] flex flex-col items-center gap-5">
      <h1 class="text-title max-w-[16ch]">
        {{ is404 ? 'Essa página não existe por aqui.' : 'Algo saiu do lugar.' }}
      </h1>
      <p class="text-lead max-w-[42ch] text-linen/60">
        {{ is404
          ? 'O endereço pode ter mudado. Que tal ver os projetos?'
          : 'Tente novamente em instantes — se persistir, fale com a gente.' }}
      </p>
      <UiButton to="/" variant="solid" @click="clearError({ redirect: '/' })">
        Voltar ao início
      </UiButton>
    </div>
  </div>
</template>
