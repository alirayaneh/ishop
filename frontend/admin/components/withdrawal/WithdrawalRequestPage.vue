<script setup lang="ts">
import type { ResourceConfig } from '~/types/admin'

const props = defineProps<{
  resource: ResourceConfig
}>()

const { request } = useAdminApi()
const listPage = useListPage(toRef(props, 'resource'))
const updating = ref(false)

async function approve(row: Record<string, any>) {
  updating.value = true
  try {
    await request('withdrawal-request/approve', { method: 'POST', body: { id: row.id } })
    await listPage.load()
  } finally {
    updating.value = false
  }
}

async function cancel(row: Record<string, any>) {
  updating.value = true
  try {
    await request('withdrawal-request/cancel', { method: 'POST', body: { id: row.id } })
    await listPage.load()
  } finally {
    updating.value = false
  }
}
</script>

<template>
  <section class="resource-page">
    <div class="page-heading">
      <h2>{{ resource.title }}</h2>
    </div>

    <ListAdminDataTable
      :resource="resource"
      :rows="listPage.rows.value"
      :loading="listPage.loading.value"
      :can-edit="false"
      :can-delete="false"
      :can-bulk="false"
    >
      <template #row-actions="{ row }">
        <button class="small-btn" type="button" :disabled="updating" @click="approve(row)">Approve</button>
        <button class="danger-btn" type="button" :disabled="updating" @click="cancel(row)">Cancel</button>
      </template>
    </ListAdminDataTable>
  </section>
</template>
