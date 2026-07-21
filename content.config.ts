import { defineCollection, defineContentConfig, z } from '@nuxt/content'
import { projectCategories } from './shared/categories'

/**
 * Uma peça de mídia. Imagem ou vídeo — os componentes tratam os dois
 * de forma transparente, então basta apontar o `src` no markdown.
 *
 * Vídeos devem ser .mp4 (H.264) e/ou .webm, sem áudio, curtos (5-12s).
 * `poster` é o frame exibido enquanto o vídeo carrega.
 */
const mediaSchema = z.object({
  type: z.enum(['image', 'video']).default('image'),
  src: z.string(),
  /** Fonte alternativa (ex.: .webm) servida antes do mp4 quando suportada. */
  srcWebm: z.string().optional(),
  poster: z.string().optional(),
  alt: z.string(),
  /** Layout na galeria: normal (1 col), wide (2 col), tall (2 linhas), full (largura total). */
  span: z.enum(['normal', 'wide', 'tall', 'full']).default('normal'),
})

export default defineContentConfig({
  collections: {
    portfolio: defineCollection({
      type: 'page',
      source: 'portfolio/*.md',
      schema: z.object({
        title: z.string(),
        subtitle: z.string(),
        category: z.enum(projectCategories),
        location: z.string(),
        year: z.number(),
        area: z.string(),
        scope: z.array(z.string()).default([]),
        /** Capa usada no grid, na home e na página imersiva. Pode ser vídeo. */
        cover: mediaSchema,
        /** Cor de acento da cena imersiva (hex). */
        accent: z.string().default('#C8A15B'),
        gallery: z.array(mediaSchema).default([]),
        featured: z.boolean().default(false),
        order: z.number().default(99),
      }),
    }),
  },
})
