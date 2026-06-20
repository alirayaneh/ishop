export function normalizeRows(response: any): Record<string, any>[] {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.data)) return response.data
  if (Array.isArray(response?.data?.data)) return response.data.data
  if (Array.isArray(response?.result)) return response.result
  if (response && typeof response === 'object' && response.id !== undefined) return [response]
  return []
}

export function normalizeRecord(response: any): Record<string, any> {
  return response?.data || response?.result || response || {}
}

export function normalizePagination(response: any) {
  const meta = response?.meta || response?.data?.meta || response?.pagination
  return {
    page: Number(meta?.current_page || meta?.page || 1),
    lastPage: Number(meta?.last_page || meta?.lastPage || 1),
    total: Number(meta?.total || 0),
    perPage: Number(meta?.per_page || meta?.perPage || 15)
  }
}

export function cellValue(row: Record<string, any>, key: string) {
  const value = key.split('.').reduce<any>((current, part) => current?.[part], row)
  if (Array.isArray(value)) {
    return value.map((item) => item?.title || item?.name || item?.email || item?.id || item).join(', ')
  }
  if (typeof value === 'object' && value !== null) {
    return value.title || value.name || value.email || value.id || '-'
  }
  if (value === 1 && key === 'status') return 'Enabled'
  if (value === 2 && key === 'status') return 'Disabled'
  if (value === 1 && key === 'verified') return 'Verified'
  if (value === 0 && key === 'verified') return 'Unverified'
  return value ?? '-'
}
