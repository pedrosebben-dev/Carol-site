import { queryCollection } from '@nuxt/content/server'
import { siteConfig } from '~~/site.config'

/**
 * Sitemap gerado a partir das rotas estáticas + todos os projetos do Content.
 * Adicionar um markdown novo em content/portfolio já o coloca aqui.
 */
export default defineEventHandler(async (event) => {
  const base = process.env.NUXT_PUBLIC_SITE_URL || siteConfig.url

  const projects = await queryCollection(event, 'portfolio').all()

  const staticRoutes = [
    { loc: '/', priority: '1.0', changefreq: 'monthly' },
    { loc: '/projetos', priority: '0.9', changefreq: 'monthly' },
    { loc: '/portfolio', priority: '0.9', changefreq: 'monthly' },
  ]

  const urls = [
    ...staticRoutes.map(r => `  <url>
    <loc>${base}${r.loc}</loc>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`),
    ...projects.map(p => `  <url>
    <loc>${base}${p.path}</loc>
    <changefreq>yearly</changefreq>
    <priority>0.8</priority>
  </url>`),
  ].join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
})
