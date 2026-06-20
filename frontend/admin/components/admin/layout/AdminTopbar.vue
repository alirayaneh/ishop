<script setup lang="ts">
const props = defineProps<{
  clearCacheLabel: string
  language: string
  languages: Array<{ name: string; code: string; direction?: string }>
  messageCount: number
}>()

const emit = defineEmits<{
  clearCacheDone: []
  clearCacheFailed: [message: string]
  languageChanged: [language: { name: string; code: string; direction?: string }]
  logout: []
}>()

const selectedLanguage = computed({
  get: () => props.language,
  set: (value: string) => {
    const language = props.languages.find((item) => item.code === value)
    if (language) emit('languageChanged', language)
  }
})
</script>

<template>
  <header class="topbar">
    <div class="topbar-left">
      <button class="menu-btn" type="button" aria-label="Menu">☰</button>
      <AdminLayoutClearCacheButton
        :label="clearCacheLabel"
        @cleared="emit('clearCacheDone')"
        @failed="emit('clearCacheFailed', $event)"
      />
    </div>

    <div class="topbar-actions">
      <AdminLayoutLanguageSelector
        v-model="selectedLanguage"
        :languages="languages"
      />
      <AdminLayoutMessageMenu :count="messageCount" />
      <NuxtLink class="topbar-link" to="/profile">♙ Profile</NuxtLink>
      <button class="link-btn" type="button" @click="emit('logout')">⏻ Logout</button>
    </div>
  </header>
</template>
