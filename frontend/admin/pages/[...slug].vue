<script setup lang="ts">
import { adminResourceMap, resolveResourceKey } from '~/composables/adminCatalog'

definePageMeta({ middleware: 'auth' })

const route = useRoute()

const slug = computed(() => {
  const value = route.params.slug
  return Array.isArray(value) ? value.join('/') : String(value || '')
})

const resourceKey = computed(() => resolveResourceKey(slug.value))
const resource = computed(() => adminResourceMap[resourceKey.value])

const id = computed(() => {
  const parts = slug.value.split('/').filter(Boolean)
  const last = parts.at(-1)
  if (last === 'new') return 'new'
  if (!last || !resource.value) return undefined

  const basePath = (resource.value.routePath || `/${resource.value.key}`).replace(/^\//, '')
  const baseParts = basePath.split('/').filter(Boolean)
  if (parts.length > baseParts.length) return last
  return undefined
})

const pageComponents: Record<string, Component> = {
  products: defineAsyncComponent(() => import('~/components/product/ProductPage.vue')),
  orders: defineAsyncComponent(() => import('~/components/order/OrderListPage.vue')),
  'roles-permissions': defineAsyncComponent(() => import('~/components/role/RoleListPage.vue')),
  'withdrawal-requests': defineAsyncComponent(() => import('~/components/withdrawal/WithdrawalRequestPage.vue')),
  'footer-links': defineAsyncComponent(() => import('~/components/cms/FooterLinksPage.vue')),
  'bulk-upload': defineAsyncComponent(() => import('~/components/tools/BulkUploadPage.vue')),
  'pos-terminal': defineAsyncComponent(() => import('~/components/pos/PosTerminalPage.vue')),
  'subscribers-send-email': defineAsyncComponent(() => import('~/components/subscriber/SendEmailPage.vue'))
}

const detailComponents: Record<string, Component> = {
  products: defineAsyncComponent(() => import('~/components/product/ProductPage.vue')),
  orders: defineAsyncComponent(() => import('~/components/order/OrderDetailPage.vue')),
  'roles-permissions': defineAsyncComponent(() => import('~/components/role/RoleEditPage.vue'))
}

const fullPageKeys = new Set([
  'pos-terminal',
  'subscribers-send-email',
  'bulk-upload',
  'footer-links',
  'withdrawal-requests',
  'orders'
])

const customDetail = computed(() => Boolean(id.value) && detailComponents[resourceKey.value])
const customFullPage = computed(() => fullPageKeys.has(resourceKey.value) && !id.value)
const activeComponent = computed(() => {
  if (customDetail.value) return detailComponents[resourceKey.value]
  if (customFullPage.value) return pageComponents[resourceKey.value]
  return null
})
</script>

<template>
  <component
    :is="activeComponent"
    v-if="activeComponent && resource"
    :resource="resource"
    :id="id"
  />
  <AdminResourcePage v-else-if="resource" :resource="resource" :id="id" />
  <section v-else class="resource-page">
    <div class="empty-state">
      <h2>Page not implemented yet</h2>
      <p>{{ slug }}</p>
    </div>
  </section>
</template>
