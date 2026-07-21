import { siteConfig } from '~~/site.config'

export default defineEventHandler((event) => {
  const base = process.env.NUXT_PUBLIC_SITE_URL || siteConfig.url

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')

  return `User-agent: *
Allow: /

Sitemap: ${base}/sitemap.xml
`
})
