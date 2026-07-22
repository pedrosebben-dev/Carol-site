<script setup lang="ts">
const { site } = useSite()

useSeoMeta({
  title: () => `${site.legalName} — ${site.tagline}`,
  description: site.description,
  ogTitle: `${site.legalName} — ${site.tagline}`,
  ogDescription: site.description,
  ogImage: '/media/og/home.jpg',
})
</script>

<template>
  <div>
    <HomeHero />
    <HomeAudience />

    <UiMarquee text="Residencial · Comercial · Marcenaria · Iluminação · Obra" :speed="46" />

    <HomeServices />
    <HomeStats />
    <HomeFeatured />
    <HomeProcess />
    <HomeAbout />
    <HomeTestimonials />
    <HomeFaq />
    <HomeCta />
  </div>
</template>
