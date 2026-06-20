<script setup lang="ts">
defineProps<{
  count: number
}>()
</script>

<template>
  <details class="message-menu">
    <summary>✉ Message ({{ count }})</summary>
    <div class="message-popover">
      <h3>User message</h3>
      <p>No Message found</p>
      <NuxtLink to="/user-messages">View all messages</NuxtLink>
    </div>
  </details>
</template>
