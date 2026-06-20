<script setup lang="ts">
import type { ResourceConfig } from '~/types/admin'

defineProps<{
  resource: ResourceConfig
}>()

const { request } = useAdminApi()
const form = ref({
  about_links: [] as Array<{ title: string; link: string }>,
  service_links: [] as Array<{ title: string; link: string }>
})
const saving = ref(false)
const loading = ref(true)

function addLink(target: 'about_links' | 'service_links') {
  form.value[target].push({ title: '', link: '' })
}

function removeLink(target: 'about_links' | 'service_links', index: number) {
  form.value[target].splice(index, 1)
}

onMounted(async () => {
  try {
    const response: any = await request('footer-link/all')
    const data = response?.data || response
    form.value.about_links = data?.about_links || []
    form.value.service_links = data?.service_links || []
  } finally {
    loading.value = false
  }
})

async function save() {
  saving.value = true
  try {
    await request('footer-link/service-about-action', { method: 'POST', body: form.value })
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <section class="resource-page">
    <div class="page-heading">
      <h2>Footer links</h2>
      <NuxtLink class="ghost-btn" to="/footer-links/payment-social?type=payment">Payment / social images</NuxtLink>
    </div>

    <div v-if="loading" class="empty-state">Loading...</div>
    <form v-else class="form-grid" @submit.prevent="save">
      <div class="panel wide">
        <div class="panel-heading">
          <h3>About links</h3>
          <button class="small-btn" type="button" @click="addLink('about_links')">Add</button>
        </div>
        <div v-for="(link, index) in form.about_links" :key="`about-${index}`" class="link-row">
          <input v-model="link.title" placeholder="Title" class="inline-input">
          <input v-model="link.link" placeholder="URL" class="inline-input">
          <button class="danger-btn" type="button" @click="removeLink('about_links', index)">Remove</button>
        </div>
      </div>

      <div class="panel wide">
        <div class="panel-heading">
          <h3>Service links</h3>
          <button class="small-btn" type="button" @click="addLink('service_links')">Add</button>
        </div>
        <div v-for="(link, index) in form.service_links" :key="`service-${index}`" class="link-row">
          <input v-model="link.title" placeholder="Title" class="inline-input">
          <input v-model="link.link" placeholder="URL" class="inline-input">
          <button class="danger-btn" type="button" @click="removeLink('service_links', index)">Remove</button>
        </div>
      </div>

      <button class="primary-btn" type="submit" :disabled="saving">Save footer links</button>
    </form>
  </section>
</template>
