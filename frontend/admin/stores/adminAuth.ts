export const useAdminAuthStore = defineStore('adminAuth', {
  state: () => ({
    token: null as string | null,
    profile: null as Record<string, any> | null
  }),
  getters: {
    authenticated: (state) => Boolean(state.token)
  },
  actions: {
    hydrate() {
      const config = useRuntimeConfig()
      const token = useCookie<string | null>(config.public.authTokenKey)
      const localToken = import.meta.client ? localStorage.getItem('token') : null
      this.token = token.value || localToken || null
    },
    setToken(tokenValue: string) {
      const config = useRuntimeConfig()
      const token = useCookie<string | null>(config.public.authTokenKey, { sameSite: 'lax' })
      token.value = tokenValue
      this.token = tokenValue
      if (import.meta.client) {
        localStorage.setItem('token', tokenValue)
        localStorage.setItem('remember_me', 'true')
      }
    },
    setProfile(profile: Record<string, any> | null) {
      this.profile = profile
    },
    logout() {
      const config = useRuntimeConfig()
      const token = useCookie<string | null>(config.public.authTokenKey)
      token.value = null
      this.token = null
      this.profile = null
      if (import.meta.client) {
        localStorage.removeItem('token')
        localStorage.removeItem('remember_me')
      }
    }
  }
})
