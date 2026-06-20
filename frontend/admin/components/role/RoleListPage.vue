<script setup lang="ts">
import type { ResourceConfig } from '~/types/admin'

const props = defineProps<{
  resource: ResourceConfig
}>()
</script>

<template>
  <AdminResourcePage :resource="resource" />
</template>
