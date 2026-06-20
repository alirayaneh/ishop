import { useAdminUiStore } from '~/stores/adminUi'

export function useAdminI18n() {
  const ui = useAdminUiStore()

  function t(path: string, fallback: string) {
    return ui.t(path, fallback)
  }

  return { t, language: computed(() => ui.language), direction: computed(() => ui.direction) }
}
