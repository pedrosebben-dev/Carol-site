/**
 * Progresso de um elemento em relação à viewport, 0..1.
 *
 * - `useElementProgress`: 0 quando o topo do elemento toca o fundo da tela,
 *   1 quando o fundo dele sai pelo topo. Bom para parallax e scale.
 * - `useStickyProgress`: 0..1 ao longo de um trecho "pinado" (um container
 *   alto com filho sticky). Bom para cenas que se transformam sem sair do lugar.
 *
 * Ambos recalculam apenas quando o scroll muda, e leem o rect uma vez por
 * frame — nada de layout thrashing.
 */

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v
}

export function useElementProgress(target: Ref<HTMLElement | null | undefined>) {
  const progress = ref(0)
  const { scrollY } = useScrollState()

  let frame = 0

  const measure = () => {
    const el = toValue(target)
    if (!el) return
    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight
    const span = rect.height + vh
    progress.value = span > 0 ? clamp01((vh - rect.top) / span) : 0
  }

  const schedule = () => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(measure)
  }

  onMounted(() => {
    measure()
    window.addEventListener('resize', schedule, { passive: true })
  })

  onBeforeUnmount(() => {
    cancelAnimationFrame(frame)
    window.removeEventListener('resize', schedule)
  })

  watch(scrollY, measure)

  return progress
}

export function useStickyProgress(target: Ref<HTMLElement | null | undefined>) {
  const progress = ref(0)
  /** Verdadeiro enquanto a cena está ocupando a tela. */
  const active = ref(false)
  const { scrollY } = useScrollState()

  let frame = 0

  const measure = () => {
    const el = toValue(target)
    if (!el) return
    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight
    const travel = rect.height - vh
    progress.value = travel > 0 ? clamp01(-rect.top / travel) : rect.top <= 0 ? 1 : 0
    active.value = rect.top <= vh * 0.5 && rect.bottom >= vh * 0.5
  }

  const schedule = () => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(measure)
  }

  onMounted(() => {
    measure()
    window.addEventListener('resize', schedule, { passive: true })
  })

  onBeforeUnmount(() => {
    cancelAnimationFrame(frame)
    window.removeEventListener('resize', schedule)
  })

  watch(scrollY, measure)

  return { progress, active }
}

/** Interpolação linear — açúcar para mapear progresso em valores de CSS. */
export function lerp(from: number, to: number, t: number) {
  return from + (to - from) * clamp01(t)
}

/** Remapeia t de [inMin, inMax] para [outMin, outMax], travado nas pontas. */
export function mapRange(
  t: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) {
  const p = clamp01((t - inMin) / (inMax - inMin))
  return outMin + (outMax - outMin) * p
}
