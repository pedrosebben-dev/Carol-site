/**
 * Estado global de scroll, alimentado pelo Lenis (plugins/lenis.client.ts).
 * Refs em escopo de módulo: uma única fonte para o site inteiro, sem
 * cada componente registrar o próprio listener de scroll.
 */

const scrollY = ref(0)
/** 0..1 do documento inteiro. */
const scrollProgress = ref(0)
/** Velocidade instantânea em px/frame — usada para skew/stretch. */
const velocity = ref(0)
/** 1 = descendo, -1 = subindo. */
const direction = ref<1 | -1>(1)
/** Verdadeiro assim que o usuário rola qualquer coisa. */
const hasScrolled = ref(false)

export function useScrollState() {
  return { scrollY, scrollProgress, velocity, direction, hasScrolled }
}
