<script setup lang="ts">
const props = defineProps<{
  page: number
  lastPage: number
  total: number
}>()

const emit = defineEmits<{
  change: [page: number]
}>()
</script>

<template>
  <div v-if="lastPage > 1" class="list-pagination">
    <button class="ghost-btn" type="button" :disabled="page <= 1" @click="emit('change', page - 1)">
      Previous
    </button>
    <span class="pagination-meta">Page {{ page }} of {{ lastPage }} ({{ total }} items)</span>
    <button class="ghost-btn" type="button" :disabled="page >= lastPage" @click="emit('change', page + 1)">
      Next
    </button>
  </div>
</template>
