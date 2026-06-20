<script setup lang="ts">
import type { ResourceConfig } from '~/types/admin'

const props = defineProps<{
  resource: ResourceConfig
  id?: string
}>()

const { request } = useAdminApi()
const dataPage = useDataPage(toRef(props, 'resource'), computed(() => props.id))
const allPermissions = ref<any[]>([])
const selected = ref<number[]>([])

async function loadPermissions() {
  const response: any = await request('role/all-permissions')
  allPermissions.value = response?.data || response || []
}

onMounted(loadPermissions)

watch(
  () => dataPage.form.value.permissions,
  (value) => {
    selected.value = (value || []).map((item: any) => item.id)
  },
  { immediate: true }
)

const grouped = computed(() => {
  const map: Record<string, any[]> = {}
  for (const permission of allPermissions.value) {
    const group = permission.name?.split('.')[0] || 'other'
    if (!map[group]) map[group] = []
    map[group].push(permission)
  }
  return map
})

function togglePermission(id: number, checked: boolean) {
  if (checked) selected.value = [...new Set([...selected.value, id])]
  else selected.value = selected.value.filter((value) => value !== id)
}

async function save() {
  dataPage.form.value.updated_permissions = selected.value
  await dataPage.save()
}
</script>

<template>
  <section class="resource-page">
    <div class="page-heading">
      <div>
        <p class="eyebrow">Edit role</p>
        <h2>{{ dataPage.form.name || 'Role' }}</h2>
      </div>
      <NuxtLink class="ghost-btn" to="/roles-permissions">Back</NuxtLink>
    </div>

    <form class="form-grid" @submit.prevent="save">
      <FormFormField
        :field="{ key: 'name', label: 'Name', required: true }"
        :model-value="dataPage.form.name"
        @update:model-value="dataPage.form.name = $event"
      />

      <div class="panel wide">
        <h3>Permissions</h3>
        <div v-for="(items, group) in grouped" :key="group" class="permission-group">
          <h4>{{ group }}</h4>
          <label v-for="permission in items" :key="permission.id" class="permission-item">
            <input
              type="checkbox"
              :checked="selected.includes(permission.id)"
              @change="togglePermission(permission.id, ($event.target as HTMLInputElement).checked)"
            >
            {{ permission.name }}
          </label>
        </div>
      </div>

      <div class="form-actions">
        <button class="primary-btn" type="submit" :disabled="dataPage.saving">Save</button>
      </div>
    </form>
  </section>
</template>
