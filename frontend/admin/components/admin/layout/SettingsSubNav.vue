<script setup lang="ts">
const route = useRoute()
const { can } = usePermissions()

const items = [
  { label: 'Currency', to: '/setting/currency' },
  { label: 'Address', to: '/setting/address' },
  { label: 'Payment', to: '/setting/payment' },
  { label: 'Social login', to: '/setting/social-login' },
  { label: 'SMTP', to: '/setting/smtp' },
  { label: 'Media storage', to: '/setting/media-storage' },
  { label: 'Miscellaneous', to: '/setting/miscellaneous' },
  { label: 'Analytics', to: '/setting/analytics' },
  { label: 'Languages', to: '/setting/languages' },
  { label: 'Plugins', to: '/setting/plugins' },
  { label: 'Clear cache', to: '/setting/clear-cache' }
]

function isActive(path: string) {
  return route.path === path || route.path.startsWith(`${path}/`)
}
</script>

<template>
  <nav class="settings-subnav">
    <NuxtLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="settings-subnav-link"
      :class="{ active: isActive(item.to) }"
    >
      {{ item.label }}
    </NuxtLink>
  </nav>
</template>
