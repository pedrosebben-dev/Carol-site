/**
 * Categorias dos projetos.
 *
 * Mora em `shared/` porque é consumida por dois lados que não podem se
 * importar: o `content.config.ts` (build, valida o frontmatter) e os
 * componentes do app (renderizam o filtro). Importar o content.config
 * direto no app arrastaria o `@nuxt/content` para o bundle do cliente.
 *
 * Adicionar uma categoria aqui já libera o valor no markdown e a coloca
 * no filtro do portfólio.
 */
export const projectCategories = [
  'Residencial',
  'Comercial',
  'Corporativo',
  'Reforma',
] as const

export type ProjectCategory = (typeof projectCategories)[number]
