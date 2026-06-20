<script setup lang="ts">
definePageMeta({ layout: 'login' })

const { request } = useAdminApi()
const email = ref('')
const loading = ref(false)
const message = ref('')
const error = ref('')

async function submit() {
  loading.value = true
  message.value = ''
  error.value = ''
  try {
    const response: any = await request('forgot-password', { method: 'POST', body: { email: email.value } })
    message.value = response?.message || 'Verification code sent'
    await navigateTo(`/verify-code?email=${encodeURIComponent(email.value)}`)
  } catch (caught: any) {
    error.value = caught?.data?.message || caught?.message || 'Could not send verification code'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form class="auth-card" @submit.prevent="submit">
    <p class="eyebrow">Recovery</p>
    <h1>Forgot password</h1>
    <p v-if="message" class="success-box">{{ message }}</p>
    <p v-if="error" class="error-box">{{ error }}</p>

    <label class="field">
      <span>Email</span>
      <input v-model.trim="email" type="email" required>
    </label>

    <button class="primary-btn block" type="submit" :disabled="loading">
      {{ loading ? 'Sending...' : 'Send code' }}
    </button>

    <NuxtLink class="table-link" to="/login">Back to login</NuxtLink>
  </form>
</template>
