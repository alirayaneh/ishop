<script setup lang="ts">
import type { FieldConfig } from '~/types/admin'

const props = defineProps<{
  field: FieldConfig
  modelValue: any
}>()

const emit = defineEmits<{
  'update:modelValue': [value: any]
}>()

function onFile(event: Event) {
  const input = event.target as HTMLInputElement
  emit('update:modelValue', props.field.multiple ? Array.from(input.files || []) : input.files?.[0] || null)
}

function parseJsonValue(value: string) {
  try {
    emit('update:modelValue', value ? JSON.parse(value) : null)
  } catch {
    emit('update:modelValue', value)
  }
}
</script>

<template>
  <label class="field" :class="{ wide: field.wide || field.type === 'textarea' || field.type === 'richtext' }">
    <span>{{ field.label }}</span>
    <small v-if="field.hint" class="field-hint">{{ field.hint }}</small>

    <textarea
      v-if="field.type === 'textarea' || field.type === 'richtext'"
      :value="modelValue || ''"
      :required="field.required"
      rows="6"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />

    <textarea
      v-else-if="field.type === 'json' || field.type === 'array'"
      :value="typeof modelValue === 'string' ? modelValue : JSON.stringify(modelValue ?? (field.type === 'array' ? [] : {}), null, 2)"
      :required="field.required"
      rows="7"
      spellcheck="false"
      @input="parseJsonValue(($event.target as HTMLTextAreaElement).value)"
    />

    <select
      v-else-if="field.type === 'select'"
      :value="modelValue ?? ''"
      :required="field.required"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option value="">Select</option>
      <option v-for="option in field.options || []" :key="String(option.value)" :value="String(option.value)">
        {{ option.label }}
      </option>
    </select>

    <input
      v-else-if="field.type === 'checkbox'"
      type="checkbox"
      :checked="Boolean(modelValue)"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked ? 1 : 0)"
    >

    <input
      v-else-if="field.type === 'file'"
      type="file"
      :required="field.required"
      :accept="field.accept"
      :multiple="field.multiple"
      @change="onFile"
    >

    <input
      v-else
      :type="field.type || 'text'"
      :value="modelValue ?? ''"
      :required="field.required"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
  </label>
</template>
