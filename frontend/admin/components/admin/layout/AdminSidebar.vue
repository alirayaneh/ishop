<script setup lang="ts">
import { adminNavGroups } from '~/composables/adminNavGroups'

defineProps<{
  currentPath: string
}>()

const { can } = usePermissions()

const visibleGroups = computed(() => {
  return adminNavGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !item.gate || can(item.gate, 'view'))
    }))
    .filter((group) => group.items.length > 0)
})

function isActive(path: string, currentPath: string) {
  if (path === '/') return currentPath === '/'
  return currentPath === path || currentPath.startsWith(`${path}/`)
}
</script>

<template>
  <aside class="sidebar">
    <NuxtLink class="brand" to="/">
      <strong><span>HIK</span>VISION</strong>
    </NuxtLink>

    <nav class="nav">
      <div v-for="group in visibleGroups" :key="group.id" class="nav-group">
        <p class="nav-group-label">{{ group.label }}</p>
        <NuxtLink
          v-for="item in group.items"
          :key="item.to"
          :to="item.to"
          class="nav-link"
          :class="{ active: isActive(item.to, currentPath) }"
        >
          <span class="nav-icon"></span>
          {{ item.label }}
        </NuxtLink>
      </div>
    </nav>
  </aside>
</template>
