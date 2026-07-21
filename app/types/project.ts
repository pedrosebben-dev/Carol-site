export interface ProjectMedia {
  type?: 'image' | 'video'
  src: string
  srcWebm?: string
  poster?: string
  alt: string
  span?: 'normal' | 'wide' | 'tall' | 'full'
}

export interface Project {
  /** Rota gerada pelo Nuxt Content, ex.: /portfolio/casa-aurora */
  path: string
  title: string
  subtitle: string
  category: string
  location: string
  year: number
  area: string
  scope: string[]
  cover: ProjectMedia
  accent: string
  gallery: ProjectMedia[]
  featured: boolean
  order: number
}

/** Último segmento da rota — usado como chave de view-transition. */
export function projectSlug(project: Pick<Project, 'path'>) {
  return project.path.split('/').filter(Boolean).pop() ?? 'projeto'
}
