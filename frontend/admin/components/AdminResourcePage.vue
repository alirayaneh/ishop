<script setup lang="ts">
import type { ResourceConfig } from '~/types/admin'

const props = defineProps<{
  resource: ResourceConfig
  id?: string
}>()

const { can } = usePermissions()
const route = useRoute()

const isDetail = computed(() => Boolean(props.id))
const isNew = computed(() => props.id === 'new')
const gate = computed(() => props.resource.gate)

const canView = computed(() => can(gate.value, 'view'))
const canCreate = computed(() => can(gate.value, 'create') && !props.resource.listOptions?.noCreate)
const canEdit = computed(() => can(gate.value, 'edit') && !props.resource.listOptions?.noEdit)
const canDelete = computed(() => can(gate.value, 'delete') && !props.resource.listOptions?.noDelete)
const canBulk = computed(() => canDelete.value && !props.resource.listOptions?.noBulk)

const listPage = useListPage(toRef(props, 'resource'))
const dataPage = useDataPage(toRef(props, 'resource'), computed(() => props.id))

const searchDraft = ref(String(route.query.q || ''))

watch(() => route.query.q, (value) => {
  searchDraft.value = String(value || '')
})

function onSearch() {
  listPage.updateQuery({ q: searchDraft.value, page: 1 })
}

function onSort(column: string) {
  const current = listPage.queryState.value.orderby
  const currentType = listPage.queryState.value.type
  const nextType = current === column && currentType === 'desc' ? 'asc' : 'desc'
  listPage.updateQuery({ orderby: column, type: nextType, page: 1 })
}

const basePath = computed(() => props.resource.routePath || `/${props.resource.key}`)
const showSettingsNav = computed(() => props.resource.settingsLayout || route.path.startsWith('/setting'))

async function save() {
  await dataPage.save()
}

async function clearCacheOnly() {
  if (!props.resource.save) return
  dataPage.saving.value = true
  try {
    await useAdminApi().request(props.resource.save)
  } finally {
    dataPage.saving.value = false
  }
}
</script>

<template>
  <section v-if="!canView && gate" class="resource-page">
    <div class="empty-state">You do not have permission to view this section.</div>
  </section>

  <section v-else class="resource-page">
    <AdminLayoutSettingsSubNav v-if="showSettingsNav" />

    <div class="page-heading">
      <div>
        <p class="eyebrow">{{ isDetail ? 'Edit record' : 'Manage records' }}</p>
        <h2>{{ resource.title }}</h2>
      </div>
      <NuxtLink
        v-if="!isDetail && canCreate && resource.save"
        class="primary-btn"
        :to="`${basePath}/new`"
      >
        Create
      </NuxtLink>
    </div>

    <p v-if="listPage.error.value || dataPage.error.value" class="error-box">
      {{ listPage.error.value || dataPage.error.value }}
    </p>

    <template v-if="isDetail || (!resource.list && resource.save)">
      <FormAdminResourceForm
        v-model="dataPage.form"
        :resource="resource"
        :saving="dataPage.saving"
        @submit="save"
      />
    </template>

    <div v-else-if="resource.key === 'setting-clear-cache'" class="action-panel">
      <button class="primary-btn" type="button" :disabled="dataPage.saving" @click="clearCacheOnly">
        {{ dataPage.saving ? 'Working...' : 'Clear cache' }}
      </button>
    </div>

    <template v-else-if="resource.list">
      <ListListToolbar
        v-model:search="searchDraft"
        :can-create="canCreate && Boolean(resource.save)"
        :create-to="`${basePath}/new`"
        :can-bulk-delete="canBulk && Boolean(resource.remove)"
        :selected-count="listPage.selectedIds.value.length"
        @search="onSearch"
        @bulk-delete="listPage.removeBulk"
      >
        <NuxtLink v-if="resource.key === 'subscribers'" class="ghost-btn" to="/subscribers/send-email">Send email</NuxtLink>
        <NuxtLink v-if="resource.key === 'images'" class="ghost-btn" to="/images/new">Upload</NuxtLink>
      </ListListToolbar>

      <ListAdminDataTable
        :resource="resource"
        :rows="listPage.rows.value"
        :loading="listPage.loading.value"
        :selected-ids="listPage.selectedIds.value"
        :can-edit="canEdit && Boolean(resource.find)"
        :can-delete="canDelete && Boolean(resource.remove)"
        :can-bulk="canBulk && Boolean(resource.remove)"
        :order-by="listPage.queryState.value.orderby"
        @sort="onSort"
        @toggle-all="listPage.toggleAll"
        @toggle-row="listPage.toggleRow"
        @delete="(row) => listPage.removeOne(row.id)"
      />

      <ListListPagination
        :page="listPage.pagination.value.page"
        :last-page="listPage.pagination.value.lastPage"
        :total="listPage.pagination.value.total"
        @change="(page) => listPage.updateQuery({ page })"
      />
    </template>
  </section>
</template>
