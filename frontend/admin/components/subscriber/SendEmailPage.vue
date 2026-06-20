<script setup lang="ts">
import type { ResourceConfig } from '~/types/admin'

defineProps<{
  resource: ResourceConfig
}>()

const { request } = useAdminApi()
const formats = ref<any[]>([])
const formatId = ref('')
const sending = ref(false)
const message = ref('')

onMounted(async () => {
  const response: any = await request('subscription-email-format/all')
  formats.value = response?.data || response || []
  if (formats.value[0]?.id) formatId.value = String(formats.value[0].id)
})

async function send() {
  if (!formatId.value) return
  sending.value = true
  message.value = ''
  try {
    await request('subscriber/send-subscription-email', {
      method: 'POST',
      body: { id: formatId.value }
    })
    message.value = 'Email sent to subscribers.'
  } catch (caught: any) {
    message.value = caught?.data?.message || caught?.message || 'Send failed'
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <section class="resource-page">
    <div class="page-heading">
      <h2>Send subscription email</h2>
      <NuxtLink class="ghost-btn" to="/subscribers">Back</NuxtLink>
    </div>

    <form class="form-grid narrow" @submit.prevent="send">
      <label class="field">
        <span>Email format</span>
        <select v-model="formatId" required>
          <option v-for="format in formats" :key="format.id" :value="String(format.id)">
            {{ format.title }}
          </option>
        </select>
      </label>
      <p v-if="message" class="notice-box">{{ message }}</p>
      <button class="primary-btn" type="submit" :disabled="sending">
        {{ sending ? 'Sending...' : 'Send email' }}
      </button>
    </form>
  </section>
</template>
