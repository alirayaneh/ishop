export default defineNuxtPlugin(async () => {
  const auth = useAdminAuthStore()
  const ui = useAdminUiStore()
  const route = useRoute()

  auth.hydrate()
  ui.hydrateLanguage()

  const publicPaths = ['/login', '/forgot-password', '/verify-code']
  if (!auth.token || publicPaths.includes(route.path)) return

  const { request } = useAdminApi()

  try {
    if (!auth.profile) {
      const profile: any = await request('profile')
      const payload = profile?.data || profile
      auth.setProfile(payload)
      ui.setProfile(payload)
    }

    if (!Object.keys(ui.translations).length) {
      const localization: any = await request('localization')
      ui.setTranslations(localization?.data || localization || {})
    }
  } catch {
    // Profile load failures are handled by the API client on protected routes.
  }
})
