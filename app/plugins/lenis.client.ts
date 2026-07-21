import Lenis from 'lenis'

/**
 * Smooth scroll (Lenis) + estado global de scroll.
 *
 * Lenis intercepta a roda do mouse e interpola a posição, o que dá o
 * "peso" característico dos sites de estúdio. Como ele vira a fonte da
 * verdade do scroll, todo efeito scroll-linked lê daqui.
 *
 * Respeita prefers-reduced-motion: se o usuário pediu menos movimento,
 * o Lenis nem é instanciado e um listener nativo alimenta o mesmo estado.
 * Nos dois casos o resto do site continua funcionando igual.
 */
export default defineNuxtPlugin(() => {
  const { scrollY, scrollProgress, velocity, direction, hasScrolled } = useScrollState()

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  let lenis: Lenis | null = null

  if (prefersReduced) {
    const onScroll = () => {
      const y = window.scrollY
      direction.value = y > scrollY.value ? 1 : -1
      scrollY.value = y
      const max = document.documentElement.scrollHeight - window.innerHeight
      scrollProgress.value = max > 0 ? y / max : 0
      if (y > 4) hasScrolled.value = true
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
  }
  else {
    lenis = new Lenis({
      // Duração alta + expo out = deslize longo, sem parecer travado.
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      // Em touch o scroll nativo já é bom e interceptar prejudica a UX.
      syncTouch: false,
      touchMultiplier: 1.6,
      wheelMultiplier: 1,
    })

    // O Lenis emite a própria instância no evento de scroll.
    lenis.on('scroll', (instance: Lenis) => {
      scrollY.value = instance.scroll
      scrollProgress.value = instance.progress
      velocity.value = instance.velocity
      direction.value = instance.direction === -1 ? -1 : 1
      if (instance.scroll > 4) hasScrolled.value = true
    })

    const raf = (time: number) => {
      lenis?.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    // Nova rota: volta ao topo e remede a altura do documento.
    const router = useRouter()
    router.afterEach((to, from) => {
      if (to.path !== from.path && !to.hash) {
        lenis?.scrollTo(0, { immediate: true })
      }
    })

    const nuxtApp = useNuxtApp()
    nuxtApp.hook('page:finish', () => {
      lenis?.resize()
    })
  }

  /**
   * Scroll suave programático — usado pelo menu e pelas âncoras.
   * Funciona com ou sem Lenis.
   */
  const scrollTo = (target: string | number | HTMLElement, offset = 0) => {
    if (lenis) {
      lenis.scrollTo(target, { offset, duration: 1.4 })
      return
    }

    if (typeof target === 'number') {
      window.scrollTo({ top: target + offset })
      return
    }

    const el = typeof target === 'string' ? document.querySelector(target) : target
    if (el instanceof HTMLElement) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset })
    }
  }

  return {
    provide: { lenis, scrollTo },
  }
})
