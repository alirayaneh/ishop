<script setup lang="ts">
import type { ResourceConfig } from '~/types/admin'

const props = defineProps<{
  resource: ResourceConfig
  id?: string
}>()

const { request } = useAdminApi()
const dataPage = useDataPage(toRef(props, 'resource'), computed(() => props.id))
const statusOptions = [
  { label: 'Pending', value: 1 },
  { label: 'Confirmed', value: 2 },
  { label: 'Picked up', value: 3 },
  { label: 'On the way', value: 4 },
  { label: 'Delivered', value: 5 }
]

const lineItems = computed(() => dataPage.form.value.ordered_products || dataPage.form.value.products || [])

async function updateStatus() {
  await request('order/update-status', {
    method: 'POST',
    body: { id: props.id, status: dataPage.form.value.status }
  })
}

async function refund() {
  if (!confirm('Refund this order?')) return
  const cancellationId = dataPage.form.value.cancellation?.id
  if (!cancellationId) return
  await request('cancellation/refund/{id}', { method: 'GET', params: { id: cancellationId } })
  await dataPage.load()
}

async function sendDeliveredEmail() {
  await request('order/send-delivered-email/{id}', { method: 'GET', params: { id: props.id } })
}

async function updatePaymentStatus() {
  await request('order/payment-status', {
    method: 'POST',
    body: { id: props.id, payment_done: dataPage.form.value.payment_done }
  })
}

async function updatePaymentMethod() {
  await request('order/payment-method', {
    method: 'POST',
    body: { id: props.id, order_method: dataPage.form.value.order_method }
  })
}
</script>

<template>
  <section class="resource-page">
    <div class="page-heading">
      <div>
        <p class="eyebrow">Order detail</p>
        <h2>Order #{{ id }}</h2>
      </div>
      <div class="heading-actions">
        <button class="small-btn" type="button" @click="sendDeliveredEmail">Send delivered email</button>
        <button v-if="dataPage.form.cancellation?.id" class="danger-btn" type="button" @click="refund">Refund</button>
        <NuxtLink class="ghost-btn" to="/orders">Back</NuxtLink>
      </div>
    </div>

    <div v-if="dataPage.loading.value" class="empty-state">Loading...</div>
    <template v-else>
      <div class="detail-grid">
        <div class="panel">
          <h3>Customer</h3>
          <p>{{ dataPage.form.user?.name || dataPage.form.guest_user?.name || '-' }}</p>
          <p>{{ dataPage.form.user?.email || dataPage.form.guest_user?.email || '-' }}</p>
        </div>
        <div class="panel">
          <h3>Payment</h3>
          <p>Total: {{ dataPage.form.total_amount }}</p>
          <label class="field">
            <span>Payment method</span>
            <input v-model="dataPage.form.order_method" @change="updatePaymentMethod">
          </label>
          <label class="check-row">
            <input v-model="dataPage.form.payment_done" type="checkbox" true-value="1" false-value="0" @change="updatePaymentStatus">
            <span>Payment done</span>
          </label>
          <label class="field">
            <span>Status</span>
            <select v-model="dataPage.form.status" @change="updateStatus">
              <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </label>
        </div>
      </div>

      <div class="table-card">
        <h3>Line items</h3>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in lineItems" :key="index">
              <td>{{ item.product?.title || item.title || item.product_id }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ item.selling || item.price }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </section>
</template>
