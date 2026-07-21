<script setup lang="ts">
import type { Project } from '~/types/project'

/**
 * Projetos em destaque. Puxa do Nuxt Content — marcar `featured: true`
 * no markdown já coloca o projeto aqui, sem tocar em código.
 */

const { data } = await useAsyncData('home-featured', () =>
  queryCollection('portfolio')
    .where('featured', '=', true)
    .order('order', 'ASC')
    .limit(4)
    .all())

const projects = computed(() => (data.value ?? []) as unknown as Project[])
</script>

<template>
  <section id="projetos" class="container-x py-section">
    <div class="flex flex-wrap items-end justify-between gap-8">
      <UiSectionHead
        index="04"
        label="Projetos"
        title="Alguns ambientes recentes."
      />
      <UiButton to="/projetos" variant="outline">
        Ver todos
      </UiButton>
    </div>

    <div class="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2">
      <!-- Coluna par desce um pouco: quebra o alinhamento de grade -->
      <div
        v-for="(project, i) in projects"
        :key="project.path"
        :class="i % 2 === 1 ? 'md:mt-24' : ''"
      >
        <ProjectCard
          :project="project"
          :index="i"
          :ratio="i % 2 === 1 ? '3/4' : '4/5'"
        />
      </div>
    </div>
  </section>
</template>
