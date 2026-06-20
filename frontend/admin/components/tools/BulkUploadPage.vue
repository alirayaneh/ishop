<script setup lang="ts">
import type { ResourceConfig } from '~/types/admin'

defineProps<{
  resource: ResourceConfig
}>()

const { request, baseUrl } = useAdminApi()
const file = ref<File | null>(null)
const importing = ref(false)
const message = ref('')

function onFile(event: Event) {
  const input = event.target as HTMLInputElement
  file.value = input.files?.[0] || null
}

function exportData() {
  window.open(`${baseUrl.value}bulk/export`, '_blank')
}

async function importData() {
  if (!file.value) return
  importing.value = true
  message.value = ''
  const body = new FormData()
  body.append('file', file.value)
  try {
    await request('bulk/import', { method: 'POST', body })
    message.value = 'Import completed.'
  } catch (caught: any) {
    message.value = caught?.data?.message || caught?.message || 'Import failed'
  } finally {
    importing.value = false
  }
}
</script>

<template>
  <section class="resource-page">
    <div class="page-heading">
      <h2>Bulk upload</h2>
    </div>

    <div class="panel-grid">
      <div class="panel">
        <h3>Export</h3>
        <p>Download current catalog data as Excel.</p>
        <button class="primary-btn" type="button" @click="exportData">Export Excel</button>
      </div>
      <div class="panel">
        <h3>Import</h3>
        <input type="file" accept=".xlsx,.xls,.csv" @change="onFile">
        <button class="primary-btn" type="button" :disabled="importing || !file" @click="importData">
          {{ importing ? 'Importing...' : 'Import file' }}
        </button>
      </div>
    </div>
    <p v-if="message" class="notice-box">{{ message }}</p>
  </section>
</template>
