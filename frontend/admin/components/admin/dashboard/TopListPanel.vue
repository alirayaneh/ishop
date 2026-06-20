<script setup lang="ts">
defineProps<{
  title: string
  items: any[]
  emptyText: string
  valueSuffix?: string
}>()

function listTitle(item: any) {
  return item?.title || item?.name || item?.product?.title || item?.category?.title || item?.brand?.title || '-'
}

function listValue(item: any) {
  return item?.total || item?.amount || item?.count || 0
}
</script>

<template>
  <article class="dash-panel list-panel">
    <h2>{{ title }}</h2>
    <p v-if="!items?.length">{{ emptyText }}</p>
    <ul v-else>
      <li v-for="item in items" :key="item.id || listTitle(item)">
        <span>{{ listTitle(item) }}</span>
        <strong>{{ listValue(item) }}{{ valueSuffix || '' }}</strong>
      </li>
    </ul>
  </article>
</template>
