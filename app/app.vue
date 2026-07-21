<script setup lang="ts">
const { site } = useSite()
const { public: cfg } = useRuntimeConfig()
const route = useRoute()

useHead({
  titleTemplate: title => (title ? `${title} — ${site.legalName}` : `${site.legalName} — ${site.tagline}`),
  link: [{ rel: 'canonical', href: () => `${cfg.siteUrl}${route.path}` }],
})

useSeoMeta({
  description: site.description,
  ogSiteName: site.legalName,
  ogType: 'website',
  ogLocale: 'pt_BR',
  twitterCard: 'summary_large_image',
})

// Dados estruturados — ajuda o Google a mostrar a empresa no painel lateral.
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'InteriorDesignBusiness',
      'name': site.legalName,
      'description': site.description,
      'url': cfg.siteUrl,
      'email': site.email,
      'telephone': `+${site.whatsapp}`,
      'areaServed': { '@type': 'City', 'name': site.city },
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': site.city,
        'addressRegion': site.state,
        'addressCountry': site.country,
      },
      'sameAs': site.social.map(s => s.href),
    }),
  }],
})
</script>

<template>
  <div class="grain min-h-screen">
    <UiPreloader />
    <UiCursor />
    <UiScrollProgress />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
