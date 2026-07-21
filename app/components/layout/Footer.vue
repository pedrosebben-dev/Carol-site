<script setup lang="ts">
const { site, whatsappLink, phoneDisplay } = useSite()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="relative border-t border-line/60 bg-ink">
    <div class="container-x py-[clamp(3.5rem,7vw,6rem)]">
      <div class="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div class="flex flex-col gap-6">
          <span class="font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-none text-bone">
            {{ site.legalName }}
          </span>
          <p class="text-lead max-w-[38ch] text-linen/55">
            {{ site.description }}
          </p>
        </div>

        <nav class="flex flex-col gap-4" aria-label="Rodapé">
          <span class="eyebrow text-brass">Navegação</span>
          <NuxtLink
            v-for="item in site.nav"
            :key="item.to"
            :to="item.to"
            class="link-underline w-fit text-sm text-linen/70 transition-colors hover:text-bone"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <div class="flex flex-col gap-4">
          <span class="eyebrow text-brass">Contato</span>
          <a
            :href="whatsappLink()"
            target="_blank"
            rel="noopener noreferrer"
            class="link-underline w-fit text-sm text-linen/70 transition-colors hover:text-bone"
          >{{ phoneDisplay }}</a>
          <a
            :href="`mailto:${site.email}`"
            class="link-underline w-fit text-sm text-linen/70 transition-colors hover:text-bone"
          >{{ site.email }}</a>
          <span class="text-sm text-linen/45">{{ site.city }} — {{ site.state }}</span>

          <div class="mt-3 flex flex-col gap-2">
            <a
              v-for="s in site.social"
              :key="s.href"
              :href="s.href"
              target="_blank"
              rel="noopener noreferrer"
              class="link-underline w-fit text-sm text-linen/70 transition-colors hover:text-bone"
            >{{ s.label }}</a>
          </div>
        </div>
      </div>

      <div class="mt-14 flex flex-col gap-3 border-t border-line/60 pt-6 text-xs text-stone sm:flex-row sm:items-center sm:justify-between">
        <span>© {{ year }} {{ site.legalName }}. Todos os direitos reservados.</span>
        <span>Feito com Nuxt · Hospedado na Vercel</span>
      </div>
    </div>
  </footer>
</template>
