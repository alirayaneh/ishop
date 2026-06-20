<script setup lang="ts">
import type { ResourceConfig } from '~/types/admin'

const props = defineProps<{
  resource: ResourceConfig
}>()

const listPage = useListPage(toRef(props, 'resource'))
const route = useRoute()
const searchDraft = ref(String(route.query.q || ''))
const dateFrom = ref(String(route.query.date_from || ''))
const dateTo = ref(String(route.query.date_to || ''))

function applyFilters() {
  listPage.updateQuery({
    q: searchDraft.value,
    date_from: dateFrom.value,
    date_to: dateTo.value,
    page: 1
  })
}

</script>

<template>
  <section class="resource-page">
    <div class="page-heading">
      <div>
        <p class="eyebrow">Manage records</p>
        <h2>{{ resource.title }}</h2>
      </div>
    </div>

    <div class="filter-row">
      <input v-model="searchDraft" type="search" class="search-input" placeholder="Search orders" @keyup.enter="applyFilters">
      <input v-model="dateFrom" type="date" class="inline-input" @change="applyFilters">
      <input v-model="dateTo" type="date" class="inline-input" @change="applyFilters">
      <button class="primary-btn" type="button" @click="applyFilters">Filter</button>
    </div>

    <p v-if="listPage.error.value" class="error-box">{{ listPage.error.value }}</p>

    <ListAdminDataTable
      :resource="resource"
      :rows="listPage.rows.value"
      :loading="listPage.loading.value"
      :selected-ids="listPage.selectedIds.value"
      :can-edit="true"
      :can-delete="true"
      :can-bulk="true"
      :order-by="listPage.queryState.value.orderby"
      @sort="(col) => listPage.updateQuery({ orderby: col, type: listPage.queryState.value.type, page: 1 })"
      @toggle-all="listPage.toggleAll"
      @toggle-row="listPage.toggleRow"
      @delete="(row) => listPage.removeOne(row.id)"
    >
      <template #row-actions="{ row }">
        <NuxtLink class="small-btn" :to="`/orders/${row.id}`">Detail</NuxtLink>
      </template>
    </ListAdminDataTable>

    <ListListPagination
      :page="listPage.pagination.value.page"
      :last-page="listPage.pagination.value.lastPage"
      :total="listPage.pagination.value.total"
      @change="(page) => listPage.updateQuery({ page })"
    />
  </section>
</template>
