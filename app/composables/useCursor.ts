/**
 * Cursor customizado. O componente UiCursor lê este estado; qualquer
 * elemento pode mudar o formato do cursor no hover chamando `setCursor`.
 */

export type CursorVariant = 'default' | 'view' | 'drag' | 'play' | 'hidden'

const variant = ref<CursorVariant>('default')
const label = ref('')
const enabled = ref(false)

export function useCursor() {
  /**
   * Handlers prontos para espalhar num elemento:
   * <div v-bind="cursorOn('view', 'Ver projeto')">
   */
  const cursorOn = (v: CursorVariant, text = '') => ({
    onMouseenter: () => {
      variant.value = v
      label.value = text
    },
    onMouseleave: () => {
      variant.value = 'default'
      label.value = ''
    },
  })

  const setCursor = (v: CursorVariant, text = '') => {
    variant.value = v
    label.value = text
  }

  const resetCursor = () => {
    variant.value = 'default'
    label.value = ''
  }

  return { variant, label, enabled, cursorOn, setCursor, resetCursor }
}
