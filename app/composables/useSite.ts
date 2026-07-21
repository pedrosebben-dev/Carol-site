import { siteConfig } from '~~/site.config'

/**
 * Acesso ao conteúdo institucional + helpers de WhatsApp.
 * `~~/` aponta para a raiz do projeto (fora de app/).
 */
export function useSite() {
  /**
   * Monta o link do WhatsApp com mensagem pré-preenchida.
   * Passar um contexto faz a designer já receber o lead qualificado
   * ("veio do card de Comercial", "veio do projeto Casa Aurora"…).
   */
  const whatsappLink = (message?: string) => {
    const text = encodeURIComponent(message || siteConfig.whatsappDefaultMessage)
    return `https://wa.me/${siteConfig.whatsapp}?text=${text}`
  }

  const phoneDisplay = computed(() => {
    const d = siteConfig.whatsapp
    // 55 41 99999 8888 -> (41) 99999-8888
    const ddd = d.slice(2, 4)
    const rest = d.slice(4)
    const head = rest.slice(0, rest.length - 4)
    const tail = rest.slice(-4)
    return `(${ddd}) ${head}-${tail}`
  })

  return { site: siteConfig, whatsappLink, phoneDisplay }
}
