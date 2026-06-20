import type { ResourceConfig } from '~/types/admin'
import { normalizeRecord } from '~/utils/normalize'

export function useDataPage(
  resource: Ref<ResourceConfig> | ResourceConfig,
  id: Ref<string | undefined> | string | undefined
) {
  const { request } = useAdminApi()
  const router = useRouter()

  const form = ref<Record<string, any>>({})
  const loading = ref(false)
  const saving = ref(false)
  const error = ref('')

  const resourceRef = computed(() => unref(resource))
  const idRef = computed(() => unref(id))
  const isNew = computed(() => idRef.value === 'new')
  const isEdit = computed(() => Boolean(idRef.value) && !isNew.value)

  function buildBody() {
    const uploadKeys = new Set(resourceRef.value.uploadFields || [])
    const fileKeys = (resourceRef.value.fields || [])
      .filter((field) => field.type === 'file')
      .map((field) => field.key)
    const hasSeparateUpload = Boolean(resourceRef.value.upload)

    const hasFile = [...fileKeys, ...uploadKeys].some((key) => form.value[key] instanceof File)
      || [...fileKeys, ...uploadKeys].some((key) => Array.isArray(form.value[key]) && form.value[key].some((item: any) => item instanceof File))
    if (!hasFile) return form.value

    const data = new FormData()
    for (const [key, value] of Object.entries(form.value)) {
      if (value === null || value === undefined) continue
      if (hasSeparateUpload && fileKeys.includes(key)) continue
      if (uploadKeys.has(key) && !(value instanceof File) && !Array.isArray(value)) continue
      if (Array.isArray(value)) {
        value.forEach((item) => data.append(fileArrayKey(key), item as any))
      } else {
        data.append(fileFieldKey(key), value as any)
      }
    }
    return data
  }

  async function uploadFiles(recordId: string | number) {
    const config = resourceRef.value
    if (!config.upload) return

    const keys = config.uploadFields || (config.fields || []).filter((f) => f.type === 'file').map((f) => f.key)
    for (const key of keys) {
      const value = form.value[key]
      if (!(value instanceof File) && !Array.isArray(value)) continue
      const body = new FormData()
      if (key === 'header_logo' || key === 'footer_logo') {
        body.append('type', key)
      }
      if (Array.isArray(value)) {
        value.forEach((file) => body.append(fileArrayKey(key), file))
      } else {
        body.append(fileFieldKey(key), value)
      }
      await request(config.upload, { params: { id: recordId }, body })
    }
  }

  function hasPendingUploadFiles() {
    const keys = resourceRef.value.uploadFields || (resourceRef.value.fields || []).filter((f) => f.type === 'file').map((f) => f.key)
    return keys.some((key) => form.value[key] instanceof File || (Array.isArray(form.value[key]) && form.value[key].length > 0))
  }

  async function load() {
    const config = resourceRef.value
    error.value = ''
    loading.value = true

    try {
      if (isEdit.value && config.find) {
        form.value = normalizeRecord(await request(config.find, { params: { id: idRef.value } }))
      } else if (!isNew.value && config.list && !config.find) {
        form.value = normalizeRecord(await request(config.list))
      } else {
        form.value = {}
      }
    } catch (caught: any) {
      error.value = caught?.data?.message || caught?.message || 'Could not load record'
    } finally {
      loading.value = false
    }
  }

  async function save() {
    const config = resourceRef.value
    if (!config.save) return

    error.value = ''
    saving.value = true

    try {
      const response: any = await request(config.save, {
        params: { id: isNew.value ? undefined : idRef.value },
        body: buildBody()
      })
      const saved = normalizeRecord(response)
      const recordId = saved.id || idRef.value
      if (config.upload && hasPendingUploadFiles()) await uploadFiles(recordId || 'current')

      const basePath = config.routePath || `/${config.key}`
      await router.push(basePath)
    } catch (caught: any) {
      error.value = caught?.data?.message || caught?.message || 'Could not save'
    } finally {
      saving.value = false
    }
  }

  watch(() => [resourceRef.value.key, idRef.value], load, { immediate: true })

  return { form, loading, saving, error, isNew, isEdit, load, save }
}

function fileFieldKey(key: string) {
  if (['image', 'logo', 'header_logo', 'footer_logo'].includes(key)) return 'photo'
  return key
}

function fileArrayKey(key: string) {
  if (key === 'images' || key === 'photo') return 'images[]'
  return `${fileFieldKey(key)}[]`
}
