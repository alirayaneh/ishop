<script setup lang="ts">
const props = defineProps<{
  search: string
  placeholder?: string
  canCreate?: boolean
  createTo?: string
  canBulkDelete?: boolean
  selectedCount?: number
}>()

const emit = defineEmits<{
  'update:search': [value: string]
  search: []
  bulkDelete: []
}>()

let debounceTimer: ReturnType<typeof setTimeout> | undefined

function onSearchInput(event: Event) {
  const value = (event.target as HTMLInputElement).value
  emit('update:search', value)
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => emit('search'), 350)
}
</script>

<template>
  <div class="list-toolbar">
    <input
      class="search-input"
      type="search"
      :value="search"
      :placeholder="placeholder || 'Search...'"
      @input="onSearchInput"
    >

    <div class="list-toolbar-actions">
      <button
        v-if="canBulkDelete && (selectedCount || 0) > 0"
        class="danger-btn"
        type="button"
        @click="emit('bulkDelete')"
      >
        Delete selected ({{ selectedCount }})
      </button>
      <NuxtLink v-if="canCreate && createTo" class="primary-btn" :to="createTo">Create</NuxtLink>
      <slot />
    </div>
  </div>
</template>
