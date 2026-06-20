<script setup lang="ts">
const auth = useAdminAuthStore()
const ui = useAdminUiStore()
const route = useRoute()
const { request } = useAdminApi()
const notice = ref('')

async function logout() {
  try {
    await request('logout')
  } catch {
    // Local logout is enough if the token is already invalid.
  }
  auth.logout()
  await navigateTo('/login')
}

function clearCacheDone() {
  notice.value = 'Cache cleared'
  window.setTimeout(() => {
    notice.value = ''
  }, 2500)
}

function clearCacheFailed(message: string) {
  notice.value = message
}

function changeLanguage(language: { name: string; code: string; direction?: string }) {
  ui.setLanguage(language.code, language.direction === 'rtl' ? 'rtl' : 'ltr')
  if (import.meta.client) {
    localStorage.setItem('i18nextLng', language.code)
    window.location.reload()
  }
}
</script>

<template>
  <div class="admin-shell" :dir="ui.direction">
    <AdminLayoutAdminSidebar :current-path="route.path" />

    <main class="main">
      <AdminLayoutAdminTopbar
        clear-cache-label="Clear cache"
        :language="ui.language"
        :languages="ui.languages"
        :message-count="ui.messageCount"
        @clear-cache-done="clearCacheDone"
        @clear-cache-failed="clearCacheFailed"
        @language-changed="changeLanguage"
        @logout="logout"
      />

      <p v-if="notice" class="notice-box">{{ notice }}</p>

      <slot />
    </main>
  </div>
</template>
