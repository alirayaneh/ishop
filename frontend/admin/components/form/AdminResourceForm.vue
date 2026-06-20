<script setup lang="ts">
import type { ResourceConfig } from '~/types/admin'

const props = defineProps<{
  resource: ResourceConfig
  modelValue: Record<string, any>
  saving?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, any>]
  submit: []
}>()

const defaultFields = [
  { key: 'title', label: 'Title', required: true },
  { key: 'status', label: 'Status', type: 'select' as const, options: [{ label: 'Enabled', value: 1 }, { label: 'Disabled', value: 2 }] }
]

const fields = computed(() => (props.resource.fields?.length ? props.resource.fields : defaultFields))
const cancelPath = computed(() => props.resource.routePath || `/${props.resource.key}`)

function updateField(key: string, value: any) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}
</script>

<template>
  <form class="form-grid" @submit.prevent="emit('submit')">
    <FormFormField
      v-for="field in fields"
      :key="field.key"
      :field="field"
      :model-value="modelValue[field.key]"
      @update:model-value="updateField(field.key, $event)"
    />

    <div class="form-actions">
      <button class="primary-btn" type="submit" :disabled="saving">
        {{ saving ? 'Saving...' : 'Save' }}
      </button>
      <NuxtLink class="ghost-btn" :to="cancelPath">Cancel</NuxtLink>
    </div>
  </form>
</template>
