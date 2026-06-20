export const useAdminUiStore = defineStore('adminUi', {
  state: () => ({
    language: 'fa',
    direction: 'rtl' as 'rtl' | 'ltr',
    translations: {} as Record<string, any>,
    profile: null as Record<string, any> | null,
    initialized: false
  }),
  getters: {
    t: (state) => (path: string, fallback: string) => {
      const value = path.split('.').reduce((current, key) => current?.[key], state.translations)
      return typeof value === 'string' && value.trim() ? value : fallback
    },
    currencyIcon: (state) => state.profile?.setting?.currency_icon || '$',
    messageCount: (state) => state.profile?.message_count || 0,
    displayName: (state) => state.profile?.user?.name || state.profile?.user?.username || 'Admin',
    languages: (state) => state.profile?.languages || []
  },
  actions: {
    hydrateLanguage() {
      if (!import.meta.client) return
      const storedLanguage = localStorage.getItem('i18nextLng')
      if (storedLanguage) this.language = storedLanguage
    },
    setLanguage(language: string, direction: 'rtl' | 'ltr' = 'ltr') {
      this.language = language
      this.direction = direction
      if (import.meta.client) {
        localStorage.setItem('i18nextLng', language)
        document.documentElement.lang = language
        document.documentElement.dir = direction
      }
    },
    setProfile(profile: Record<string, any> | null) {
      this.profile = profile
      const storedLanguage = import.meta.client ? localStorage.getItem('i18nextLng') : null
      const selectedLanguage = profile?.languages?.find((language: any) => language.code === (storedLanguage || this.language))
      const defaultLanguage = selectedLanguage || profile?.default_language
      if (defaultLanguage?.code) {
        this.setLanguage(defaultLanguage.code, defaultLanguage.direction === 'rtl' ? 'rtl' : 'ltr')
      }
    },
    setTranslations(translations: Record<string, any>) {
      this.translations = translations || {}
    }
  }
})
