import { watch } from 'vue'

/**
 * Diretiva `v-reveal` — adiciona `.is-visible` quando o elemento entra
 * na viewport. As transições em si moram no CSS (.reveal / .reveal-clip /
 * .line-mask), então a diretiva só liga o gatilho.
 *
 * Precisa ser um plugin universal (não `.client`): o Vue procura a
 * diretiva durante o SSR para chamar `getSSRProps`, e se ela só existir
 * no cliente o render no servidor quebra.
 * O trabalho de fato acontece só em `mounted`, que nunca roda no servidor.
 *
 * Robustez: além do IntersectionObserver (que dirige a animação), há uma
 * rede de segurança lendo o scroll compartilhado (Lenis). Se o IO não
 * disparar por qualquer motivo — navegador, scroll programático, aba em
 * background — o conteúdo AINDA revela ao entrar na viewport, em vez de
 * ficar preso invisível (o que deixaria um bloco preto vazio na página).
 *
 * Uso:
 *   <div v-reveal class="reveal">…</div>
 *   <div v-reveal="{ delay: 120 }" class="reveal">…</div>
 *   <div v-reveal="{ once: false, amount: 0.4 }">…</div>
 */

interface RevealOptions {
  /** Atraso em ms antes de animar — vira --reveal-delay. */
  delay?: number
  /** Fração do elemento que precisa estar visível (0..1). */
  amount?: number
  /** Se false, remove a classe ao sair da viewport e reanima na volta. */
  once?: boolean
}

export default defineNuxtPlugin((nuxtApp) => {
  const cleanups = new WeakMap<HTMLElement, () => void>()

  nuxtApp.vueApp.directive<HTMLElement, RevealOptions | undefined>('reveal', {
    // Nada a injetar no HTML do servidor — o estado inicial já vem do CSS.
    getSSRProps() {
      return {}
    },

    mounted(el, binding) {
      const { delay = 0, amount = 0.15, once = true } = binding.value ?? {}

      if (delay) el.style.setProperty('--reveal-delay', `${delay}ms`)

      // Sem suporte a IO (ou reduced motion): mostra tudo na hora.
      if (
        typeof IntersectionObserver === 'undefined'
        || window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        el.classList.add('is-visible')
        return
      }

      let done = false
      const reveal = () => el.classList.add('is-visible')

      // Primário: IntersectionObserver dispara a entrada.
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              reveal()
              if (once) cleanup()
            }
            else if (!once) {
              el.classList.remove('is-visible')
            }
          }
        },
        { threshold: amount, rootMargin: '0px 0px -8% 0px' },
      )
      observer.observe(el)

      // Rede de segurança: revela por checagem de retângulo atrelada ao
      // scroll compartilhado. Lê o MESMO scrollY que o resto do site (sem
      // registrar listener próprio) e garante que nada fique invisível.
      const { scrollY } = useScrollState()
      const check = () => {
        const r = el.getBoundingClientRect()
        const vh = window.innerHeight || document.documentElement.clientHeight
        if (r.top < vh * 0.9 && r.bottom > vh * 0.02) {
          reveal()
          if (once) cleanup()
        }
      }
      const stopWatch = watch(scrollY, check)
      requestAnimationFrame(check)

      function cleanup() {
        if (done) return
        done = true
        observer.disconnect()
        stopWatch()
      }

      cleanups.set(el, cleanup)
    },

    unmounted(el) {
      cleanups.get(el)?.()
      cleanups.delete(el)
    },
  })
})
