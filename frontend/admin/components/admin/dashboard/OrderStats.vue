<script setup lang="ts">
defineProps<{
  title: string
  modelValue: string
  items: Array<{ label: string; value: number }>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <article class="dash-panel order-heading">
    <h2>{{ title }}</h2>
    <select :value="modelValue" @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)">
      <option value="all">همه</option>
      <option value="cod">COD</option>
      <option value="card">Card</option>
    </select>
  </article>

  <div class="order-grid">
    <article v-for="item in items.slice(0, 5)" :key="item.label" class="stat-card">
      <h3>{{ item.label }}</h3>
      <strong>{{ item.value }}</strong>
    </article>
  </div>

  <article v-if="items[5]" class="stat-card wide-stat">
    <h3>{{ items[5].label }}</h3>
    <strong>{{ items[5].value }}</strong>
  </article>
</template>
