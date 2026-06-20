import type { ResourceConfig } from '~/types/admin'
import { normalizePagination, normalizeRows } from '~/utils/normalize'

export function useListPage(resource: Ref<ResourceConfig> | ResourceConfig) {
  const { request } = useAdminApi()
  const route = useRoute()
  const router = useRouter()

  const rows = ref<Record<string, any>[]>([])
  const selectedIds = ref<number[]>([])
  const loading = ref(false)
  const error = ref('')
  const pagination = ref({ page: 1, lastPage: 1, total: 0, perPage: 15 })

  const resourceRef = computed(() => unref(resource))

  const listOptions = computed(() => resourceRef.value.listOptions || {})

  const queryState = computed(() => ({
    page: Number(route.query.page || 1),
    q: String(route.query.q || ''),
    orderby: String(route.query.orderby || listOptions.value.defaultSort || 'created_at'),
    type: String(route.query.type || listOptions.value.defaultSortType || 'desc')
  }))

  function updateQuery(patch: Record<string, string | number | undefined>) {
    router.replace({
      query: {
        ...route.query,
        ...Object.fromEntries(
          Object.entries(patch).map(([key, value]) => [key, value === undefined || value === '' ? undefined : String(value)])
        )
      }
    })
  }

  async function load() {
    const config = resourceRef.value
    if (!config.list) return

    error.value = ''
    loading.value = true
    selectedIds.value = []

    try {
      const response = await request(config.list, {
        query: {
          page: queryState.value.page,
          q: queryState.value.q,
          orderby: queryState.value.orderby,
          type: queryState.value.type,
          date_from: String(route.query.date_from || ''),
          date_to: String(route.query.date_to || '')
        }
      })
      rows.value = normalizeRows(response)
      pagination.value = normalizePagination(response)
    } catch (caught: any) {
      error.value = caught?.data?.message || caught?.message || 'Could not load list'
      rows.value = []
    } finally {
      loading.value = false
    }
  }

  function toggleAll(checked: boolean) {
    selectedIds.value = checked ? rows.value.map((row) => Number(row.id)).filter(Boolean) : []
  }

  function toggleRow(id: number, checked: boolean) {
    if (checked) {
      if (!selectedIds.value.includes(id)) selectedIds.value.push(id)
    } else {
      selectedIds.value = selectedIds.value.filter((value) => value !== id)
    }
  }

  async function removeOne(id: number | string) {
    const config = resourceRef.value
    if (!config.remove || !confirm('Delete this item?')) return
    await request(config.remove, { params: { id } })
    await load()
  }

  async function removeBulk() {
    const config = resourceRef.value
    if (!config.remove || !selectedIds.value.length || !confirm(`Delete ${selectedIds.value.length} items?`)) return
    await request(config.remove, { params: { id: selectedIds.value.join(',') } })
    await load()
  }

  watch(() => [resourceRef.value.key, route.query], load, { immediate: true, deep: true })

  return {
    rows,
    selectedIds,
    loading,
    error,
    pagination,
    queryState,
    listOptions,
    load,
    updateQuery,
    toggleAll,
    toggleRow,
    removeOne,
    removeBulk
  }
}
