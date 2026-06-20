export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: ['@pinia/nuxt', '@nuxtjs/i18n'],
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Admin panel',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }]
    }
  },
  css: ['~/assets/admin.css'],
  runtimeConfig: {
    public: {
      adminApiBase: process.env.ADMIN_API_BASE || process.env.API_BASE || '/',
      adminApiPrefix: process.env.ADMIN_API_PREFIX || 'api/admin/',
      authTokenKey: process.env.AUTH_TOKEN_KEY || 'ishop_admin_auth',
      isDemo: process.env.IS_DEMO === 'true'
    }
  },
  i18n: {
    compilation: { strictMessage: false },
    locales: [{ code: 'en' }, { code: 'fr' }, { code: 'ar' }, { code: 'tr' }, { code: 'hi' }],
    strategy: 'no_prefix',
    defaultLocale: 'en',
    detectBrowserLanguage: false,
    vueI18n: 'i18n.config.ts'
  }
})
