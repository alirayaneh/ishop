<script setup lang="ts">
import type { ResourceConfig } from '~/types/admin'
import { cellValue } from '~/utils/normalize'

const props = defineProps<{
  resource: ResourceConfig
  rows: Record<string, any>[]
  loading?: boolean
  selectedIds?: number[]
  canEdit?: boolean
  canDelete?: boolean
  canBulk?: boolean
  orderBy?: string
}>()

const emit = defineEmits<{
  sort: [column: string]
  toggleAll: [checked: boolean]
  toggleRow: [id: number, checked: boolean]
  delete: [row: Record<string, any>]
}>()

const { t } = useAdminI18n()

const columns = computed(() => props.resource.columns || ['id', 'title', 'created'])
const basePath = computed(() => props.resource.routePath || `/${props.resource.key}`)

function columnLabel(column: string) {
  return props.resource.columnLabels?.[column] || t(`category.${column}`, column.replaceAll('_', ' '))
}

const allSelected = computed(() => {
  if (!props.rows.length) return false
  return props.rows.every((row) => props.selectedIds?.includes(Number(row.id)))
})
</script>

<template>
  <div class="table-card">
    <div v-if="loading" class="empty-state">Loading...</div>
    <div v-else-if="!rows.length" class="empty-state">No data found</div>
    <table v-else>
      <thead>
        <tr>
          <th v-if="canBulk" class="check-col">
            <input type="checkbox" :checked="allSelected" @change="emit('toggleAll', ($event.target as HTMLInputElement).checked)">
          </th>
          <th
            v-for="column in columns"
            :key="column"
            class="sortable"
            @click="emit('sort', column)"
          >
            {{ columnLabel(column) }}
            <span v-if="orderBy === column" class="sort-indicator">▼</span>
          </th>
          <th class="actions-col"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id || row.code || JSON.stringify(row).slice(0, 40)">
          <td v-if="canBulk" class="check-col">
            <input
              type="checkbox"
              :checked="selectedIds?.includes(Number(row.id))"
              @change="emit('toggleRow', Number(row.id), ($event.target as HTMLInputElement).checked)"
            >
          </td>
          <td v-for="column in columns" :key="column">
            <NuxtLink
              v-if="canEdit && column === 'title' && row.id && resource.find"
              class="table-link"
              :to="`${basePath}/${row.id}`"
            >
              {{ cellValue(row, column) }}
            </NuxtLink>
            <span v-else>{{ cellValue(row, column) }}</span>
          </td>
          <td class="actions">
            <slot name="row-actions" :row="row" />
            <NuxtLink v-if="canEdit && row.id && resource.find" class="small-btn" :to="`${basePath}/${row.id}`">Edit</NuxtLink>
            <button v-if="canDelete && row.id" class="danger-btn" type="button" @click="emit('delete', row)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
