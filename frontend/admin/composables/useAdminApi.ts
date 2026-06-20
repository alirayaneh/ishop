import type { AdminEndpoint } from '~/types/admin'
import { useAdminAuthStore } from '~/stores/adminAuth'
import { useAdminUiStore } from '~/stores/adminUi'

type QueryValue = string | number | boolean | null | undefined

function trimSlashes(value: string) {
  return value.replace(/^\/+|\/+$/g, '')
}

function joinUrl(base: string, prefix: string) {
  const normalizedBase = base.trim() || '/'
  const normalizedPrefix = trimSlashes(prefix)

  if (normalizedBase === '/') return `/${normalizedPrefix}/`

  return `${normalizedBase.replace(/\/+$/g, '')}/${normalizedPrefix}/`
}

function interpolate(path: string, params: Record<string, string | number | undefined> = {}) {
  let result = path

  for (const [key, value] of Object.entries(params)) {
    result = result.replace(`{${key}}`, String(value ?? ''))
    result = result.replace(`{${key}?}`, String(value ?? ''))
  }

  if (params.id !== undefined) {
    result = result.replace(/\{[^}?]+\?\}/g, String(params.id))
    result = result.replace(/\{[^}?]+\}/g, String(params.id))
  }

  result = result.replace(/\/\{[^}?]+\?\}/g, '')

  return result.replace(/\/+$/g, '')
}

function toQuery(params?: Record<string, QueryValue>) {
  if (!params) return ''

  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined && value !== '') {
      query.set(key, String(value))
    }
  }

  const serialized = query.toString()
  return serialized ? `?${serialized}` : ''
}

export function useAdminApi() {
  const config = useRuntimeConfig()
  const auth = useAdminAuthStore()
  const ui = useAdminUiStore()

  const baseUrl = computed(() => {
    return joinUrl(
      String(config.public.adminApiBase || '/'),
      String(config.public.adminApiPrefix || 'api/admin/')
    )
  })

  async function request<T = any>(
    endpoint: AdminEndpoint | string,
    options: {
      params?: Record<string, string | number | undefined>
      query?: Record<string, QueryValue>
      body?: Record<string, any> | FormData | null
      method?: 'GET' | 'POST' | 'DELETE'
      headers?: HeadersInit
    } = {}
  ): Promise<T> {
    const endpointObject = typeof endpoint === 'string' ? { method: options.method || 'GET', path: endpoint } : endpoint
    const path = interpolate(endpointObject.path, options.params)
    const url = `${baseUrl.value}${path}${toQuery(options.query)}`
    const isFormData = options.body instanceof FormData

    try {
      return await $fetch<T>(url, {
        method: endpointObject.method,
        body: isFormData ? options.body : options.body ? JSON.stringify(options.body) : undefined,
        headers: {
          Accept: 'application/json',
          ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
          ...(auth.token ? { Authorization: `Bearer ${auth.token}` } : {}),
          ...(ui.language ? { Language: ui.language } : {}),
          ...options.headers
        }
      })
    } catch (error: any) {
      if (error?.status === 401 || error?.statusCode === 401) {
        auth.logout()
        await navigateTo('/login')
      }
      throw error
    }
  }

  return { request, baseUrl }
}
