<script setup lang="ts">
definePageMeta({ layout: 'login' })

const route = useRoute()
const auth = useAdminAuthStore()
const { request } = useAdminApi()

const email = ref('')
const password = ref('')
const remember = ref(false)
const loading = ref(false)
const error = ref('')

async function login() {
  error.value = ''
  loading.value = true

  try {
    const response: any = await request('login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
        remember_token: remember.value
      }
    })

    const token = response?.token || response?.data?.token
    if (!token) throw new Error('Login response did not include a token')

    auth.setToken(token)

    try {
      const profile: any = await request('profile')
      const payload = profile?.data || profile
      auth.setProfile(payload)
      useAdminUiStore().setProfile(payload)
      const localization: any = await request('localization')
      useAdminUiStore().setTranslations(localization?.data || localization || {})
    } catch {
      auth.setProfile(null)
    }

    await navigateTo(String(route.query.redirect || '/'))
  } catch (caught: any) {
    error.value = caught?.data?.message || caught?.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form class="auth-card" @submit.prevent="login">
    <p class="eyebrow">Admin</p>
    <h1>Sign in</h1>
    <p v-if="error" class="error-box">{{ error }}</p>

    <label class="field">
      <span>Email</span>
      <input v-model.trim="email" type="email" required autocomplete="email">
    </label>

    <label class="field">
      <span>Password</span>
      <input v-model="password" type="password" required autocomplete="current-password">
    </label>

    <label class="check-row">
      <input v-model="remember" type="checkbox">
      <span>Remember me</span>
    </label>

    <button class="primary-btn block" type="submit" :disabled="loading">
      {{ loading ? 'Signing in...' : 'Sign in' }}
    </button>

    <NuxtLink class="table-link" to="/forgot-password">Forgot password?</NuxtLink>
  </form>
</template>
