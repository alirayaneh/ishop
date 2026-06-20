<script setup lang="ts">
defineProps<{
  cards: Array<{
    label: string
    value: string | number
    className: string
    icon: string
  }>
}>()
</script>

<template>
  <div class="metric-grid">
    <article v-for="card in cards" :key="card.label" class="metric-card" :class="card.className">
      <div>
        <h3>{{ card.label }}</h3>
        <strong>{{ card.value }}</strong>
      </div>
      <span class="metric-icon" :data-icon="card.icon"></span>
    </article>
  </div>
</template>
