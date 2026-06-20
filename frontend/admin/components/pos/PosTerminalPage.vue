<script setup lang="ts">
import type { ResourceConfig } from '~/types/admin'

defineProps<{
  resource: ResourceConfig
}>()

const { request } = useAdminApi()
const ui = useAdminUiStore()
const search = ref('')
const products = ref<any[]>([])
const cart = ref<Array<{ product: any; quantity: number }>>([])
const loading = ref(false)
const checkoutLoading = ref(false)

const total = computed(() => {
  return cart.value.reduce((sum, item) => {
    const price = Number(item.product.offered || item.product.selling || 0)
    return sum + price * item.quantity
  }, 0)
})

async function searchProducts() {
  loading.value = true
  try {
    const response: any = await request('product/all', { query: { q: search.value, page: 1 } })
    products.value = response?.data || response || []
  } finally {
    loading.value = false
  }
}

function addToCart(product: any) {
  const existing = cart.value.find((item) => item.product.id === product.id)
  if (existing) existing.quantity += 1
  else cart.value.push({ product, quantity: 1 })
}

function removeFromCart(index: number) {
  cart.value.splice(index, 1)
}

async function checkout() {
  checkoutLoading.value = true
  try {
    await request('pos-order/action', {
      method: 'POST',
      body: {
        products: cart.value.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          selling: item.product.selling,
          offered: item.product.offered
        })),
        total_amount: total.value,
        payment_method: 1
      }
    })
    cart.value = []
  } finally {
    checkoutLoading.value = false
  }
}
</script>

<template>
  <section class="resource-page pos-terminal">
    <div class="page-heading">
      <h2>POS terminal</h2>
      <NuxtLink class="ghost-btn" to="/pos/configuration">Configuration</NuxtLink>
    </div>

    <div class="pos-grid">
      <div class="panel">
        <div class="filter-row">
          <input v-model="search" class="search-input" placeholder="Search products" @keyup.enter="searchProducts">
          <button class="primary-btn" type="button" @click="searchProducts">Search</button>
        </div>
        <div v-if="loading" class="empty-state">Loading...</div>
        <div class="pos-product-list">
          <button
            v-for="product in products"
            :key="product.id"
            class="pos-product"
            type="button"
            @click="addToCart(product)"
          >
            <strong>{{ product.title }}</strong>
            <span>{{ product.offered || product.selling }} {{ ui.currencyIcon }}</span>
          </button>
        </div>
      </div>

      <div class="panel">
        <h3>Cart</h3>
        <div v-for="(item, index) in cart" :key="index" class="cart-row">
          <span>{{ item.product.title }} × {{ item.quantity }}</span>
          <button class="danger-btn" type="button" @click="removeFromCart(index)">Remove</button>
        </div>
        <p class="cart-total">Total: {{ total }} {{ ui.currencyIcon }}</p>
        <button class="primary-btn block" type="button" :disabled="!cart.length || checkoutLoading" @click="checkout">
          {{ checkoutLoading ? 'Processing...' : 'Checkout' }}
        </button>
      </div>
    </div>
  </section>
</template>
