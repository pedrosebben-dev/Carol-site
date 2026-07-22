/**
 * Fonte única de verdade do conteúdo institucional.
 * Troque os valores aqui e o site inteiro acompanha — nenhum texto de marca
 * fica espalhado pelos componentes.
 */

export interface NavItem {
  label: string
  to: string
}

export interface SocialLink {
  label: string
  href: string
}

export const siteConfig = {
  /** Nome curto usado no logo e no <title> */
  name: 'Carolina Dill',
  /** Nome completo usado em textos e dados estruturados */
  legalName: 'Carolina Dill Interiores',
  /** Assinatura que aparece no header/footer */
  tagline: 'Design de Interiores',
  description:
    'Projetos de interiores residenciais e comerciais que unem funcionalidade, '
    + 'identidade e conforto. Do conceito à execução, com acompanhamento completo de obra.',

  /** URL de produção — usada em canonical, OG e sitemap */
  url: 'https://carolinadill.com.br',

  /** Contato */
  email: 'contato@carolinadill.com.br',
  city: 'Canela',
  state: 'RS',
  country: 'BR',

  /**
   * WhatsApp no formato internacional, apenas dígitos: 55 + DDD + número.
   * Ex.: (41) 99999-8888 -> '5541999998888'
   */
  whatsapp: '5554991390665',
  whatsappDefaultMessage:
    'Olá, Carolina! Vim pelo site e gostaria de solicitar um orçamento para um projeto de interiores.',

  social: [
    { label: 'Instagram', href: 'https://instagram.com/carolinadill' },
    { label: 'Pinterest', href: 'https://pinterest.com/carolinadill' },
    { label: 'Behance', href: 'https://behance.net/carolinadill' },
  ] satisfies SocialLink[],

  nav: [
    { label: 'Serviços', to: '/#servicos' },
    { label: 'Projetos', to: '/portfolio' },
    { label: 'Processo', to: '/#processo' },
    { label: 'Sobre', to: '/#sobre' },
    { label: 'Dúvidas', to: '/#faq' },
  ] satisfies NavItem[],
} as const

export type SiteConfig = typeof siteConfig
