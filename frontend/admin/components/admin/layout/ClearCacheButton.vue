<script setup lang="ts">
const props = defineProps<{
  label: string
}>()

const emit = defineEmits<{
  cleared: []
  failed: [message: string]
}>()

const { request } = useAdminApi()
const loading = ref(false)

async function clearCache() {
  loading.value = true
  try {
    await request('clear-cache', { method: 'POST', body: {} })
    emit('cleared')
  } catch (caught: any) {
    emit('failed', caught?.data?.message || caught?.message || 'Clear cache failed')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <button class="ghost-btn clear-cache" type="button" :disabled="loading" @click="clearCache">
    {{ loading ? '...' : props.label }}
  </button>
</template>
