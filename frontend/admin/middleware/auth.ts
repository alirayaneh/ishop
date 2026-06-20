export default defineNuxtRouteMiddleware((to) => {
  const auth = useAdminAuthStore()
  const ui = useAdminUiStore()
  auth.hydrate()
  ui.hydrateLanguage()

  const publicRoutes = ['/login', '/forgot-password', '/verify-code']
  if (!auth.authenticated && !publicRoutes.includes(to.path)) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }

  if (auth.authenticated && to.path === '/login') {
    return navigateTo('/')
  }
})
