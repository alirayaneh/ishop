<script setup lang="ts">
definePageMeta({ layout: 'login' })

const route = useRoute()
const { request } = useAdminApi()
const email = ref(String(route.query.email || ''))
const code = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const message = ref('')

async function submit() {
  loading.value = true
  error.value = ''
  message.value = ''
  try {
    const response: any = await request('verify-code', {
      method: 'POST',
      body: { email: email.value, code: code.value, password: password.value }
    })
    message.value = response?.message || 'Password updated'
    await navigateTo('/login')
  } catch (caught: any) {
    error.value = caught?.data?.message || caught?.message || 'Verification failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form class="auth-card" @submit.prevent="submit">
    <p class="eyebrow">Recovery</p>
    <h1>Verify code</h1>
    <p v-if="message" class="success-box">{{ message }}</p>
    <p v-if="error" class="error-box">{{ error }}</p>

    <label class="field">
      <span>Email</span>
      <input v-model.trim="email" type="email" required>
    </label>
    <label class="field">
      <span>Code</span>
      <input v-model.trim="code" type="text" required>
    </label>
    <label class="field">
      <span>New password</span>
      <input v-model="password" type="password" required>
    </label>

    <button class="primary-btn block" type="submit" :disabled="loading">
      {{ loading ? 'Verifying...' : 'Update password' }}
    </button>
  </form>
</template>
