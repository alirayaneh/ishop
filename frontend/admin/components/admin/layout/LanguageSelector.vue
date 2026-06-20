<script setup lang="ts">
defineProps<{
  modelValue: string
  languages: Array<{ name: string; code: string; direction?: string }>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  emit('update:modelValue', value)
}
</script>

<template>
  <select
    class="language-select"
    :value="modelValue"
    @change="onChange"
  >
    <option v-for="language in languages" :key="language.code" :value="language.code">
      {{ language.name }}
    </option>
  </select>
</template>
