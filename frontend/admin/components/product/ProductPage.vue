<script setup lang="ts">
import type { ResourceConfig } from '~/types/admin'

const props = defineProps<{
  resource: ResourceConfig
  id?: string
}>()

const { request } = useAdminApi()
const { can } = usePermissions()
const config = useRuntimeConfig()
const router = useRouter()
const dataPage = useDataPage(toRef(props, 'resource'), computed(() => props.id))
const form = dataPage.form
const loading = dataPage.loading
const error = dataPage.error

const categories = ref<any[]>([])
const brands = ref<any[]>([])
const taxRules = ref<any[]>([])
const shippingRules = ref<any[]>([])
const bundleDeals = ref<any[]>([])
const collections = ref<any[]>([])
const inventories = ref<any[]>([])
const saving = ref(false)
const uploadBusy = ref('')
const inventoryError = ref('')
const isNew = computed(() => props.id === 'new')
const productId = computed(() => form.value.id || props.id)

const selectedCategories = computed({
  get: () => normalizeIds(form.value.product_categories, 'category_id'),
  set: (value: Array<string | number>) => {
    form.value.product_categories = value.map(Number).filter(Boolean)
    if (!value.includes(form.value.primary_category_id)) {
      form.value.primary_category_id = value[0] || ''
    }
  }
})

const selectedCollections = computed({
  get: () => normalizeIds(form.value.product_collections, 'product_collection_id'),
  set: (value: Array<string | number>) => {
    form.value.product_collections = value.map(Number).filter(Boolean)
  }
})

watch(() => form.value.id, async (id) => {
  if (!id) return
  selectedCategories.value = normalizeIds(form.value.product_categories, 'category_id')
  selectedCollections.value = normalizeIds(form.value.product_collections, 'product_collection_id')
  if (!form.value.primary_category_id && selectedCategories.value.length) {
    form.value.primary_category_id = selectedCategories.value[0]
  }
  await loadInventories(id)
})

onMounted(async () => {
  await loadOptions()
  if (props.id && props.id !== 'new') await loadInventories(props.id)
})

function unwrapList(response: any) {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.data)) return response.data
  if (Array.isArray(response?.data?.data)) return response.data.data
  return []
}

function normalizeIds(value: any, key: string) {
  if (!Array.isArray(value)) return []
  return value.map((item) => Number(typeof item === 'object' ? item[key] || item.id : item)).filter(Boolean)
}

async function loadOptions() {
  const [catRes, brandRes, taxRes, shippingRes, bundleRes, collectionRes] = await Promise.allSettled([
    request('category/all-categories'),
    request('brand/all-brands'),
    request('tax-rule/all-tax-rules'),
    request('shipping-rule/all-shipping-rules'),
    request('bundle-deal/all-bundle-deals'),
    request('product-collection/all-product-collections')
  ])
  categories.value = settledList(catRes)
  brands.value = settledList(brandRes)
  taxRules.value = settledList(taxRes)
  shippingRules.value = settledList(shippingRes)
  bundleDeals.value = settledList(bundleRes)
  collections.value = settledList(collectionRes)
}

function settledList(result: PromiseSettledResult<any>) {
  return result.status === 'fulfilled' ? unwrapList(result.value) : []
}

async function loadInventories(id: string | number) {
  try {
    const response = await request('updated-inventory/find/{productId}', { params: { productId: id } })
    inventories.value = unwrapList(response).map((item) => ({
      id: item.id,
      sku: item.sku || '',
      quantity: item.quantity || 0,
      price: item.price || 0,
      values: (item.inventory_attributes || []).map((attr: any) => attr.attribute_value).filter(Boolean)
    }))
  } catch (error: any) {
    inventoryError.value = error?.data?.message || error?.message || 'Could not load inventory'
  }
}

function productBody() {
  const ignored = new Set(['image_file', 'video_file', 'video_thumb_file', 'gallery_files', 'product_images', 'flash_sale_product'])
  const body: Record<string, any> = {}
  for (const [key, value] of Object.entries(form.value)) {
    if (!ignored.has(key) && value !== undefined && !(value instanceof File)) body[key] = value
  }
  body.product_categories = selectedCategories.value
  body.primary_category_id = form.value.primary_category_id || selectedCategories.value[0] || ''
  body.product_collections = selectedCollections.value
  return body
}

async function saveProduct() {
  if (!props.resource.save) return
  saving.value = true
  error.value = ''
  try {
    const response = await request(props.resource.save, {
      params: { id: isNew.value ? undefined : props.id },
      body: productBody()
    })
    form.value = normalizeProduct(response)
    const id = form.value.id || props.id
    if (id) {
      await saveInventories(id)
      await uploadPendingFiles(id)
    }
    await router.push(`/products/${id}`)
  } catch (caught: any) {
    error.value = caught?.data?.message || caught?.message || 'Could not save product'
  } finally {
    saving.value = false
  }
}

async function saveInventories(id: string | number) {
  if (!inventories.value.length) return
  const payload = inventories.value.map((item) => ({
    id: item.id,
    sku: item.sku,
    quantity: Number(item.quantity || 0),
    price: Number(item.price || 0),
    values: Array.isArray(item.values) ? item.values.map((value: any) => ({ id: value.id || value })) : []
  }))
  const response = await request('updated-inventory/action/{productId}', {
    method: 'POST',
    params: { productId: id },
    body: { inventories: payload }
  })
  inventories.value = unwrapList(response)
}

async function uploadPendingFiles(id: string | number) {
  if (form.value.image_file) await uploadMainImage(id)
  if (form.value.gallery_files?.length) await uploadGallery(id)
  if (form.value.video_file && form.value.video_thumb_file) await uploadVideo(id)
}

async function uploadMainImage(id = productId.value) {
  if (!id || !form.value.image_file) return
  uploadBusy.value = 'image'
  const body = new FormData()
  body.append('photo', form.value.image_file)
  form.value = normalizeProduct(await request('product/upload/{id?}', { method: 'POST', params: { id }, body }))
  uploadBusy.value = ''
}

async function uploadGallery(id = productId.value) {
  if (!id || !form.value.gallery_files?.length) return
  uploadBusy.value = 'gallery'
  const body = new FormData()
  form.value.gallery_files.forEach((file: File) => body.append('images[]', file))
  const response = await request('product/upload-images/{productId}', { method: 'POST', params: { productId: id }, body })
  form.value.product_images = unwrapList(response)
  form.value.gallery_files = []
  uploadBusy.value = ''
}

async function uploadVideo(id = productId.value) {
  if (!id || !form.value.video_file || !form.value.video_thumb_file) return
  uploadBusy.value = 'video'
  const body = new FormData()
  body.append('video_file', form.value.video_file)
  body.append('thumb', form.value.video_thumb_file)
  form.value = normalizeProduct(await request('product/upload-video/{id?}', { method: 'POST', params: { id }, body }))
  uploadBusy.value = ''
}

async function deleteProductImage(imageId: string | number) {
  if (!confirm('Delete this image?')) return
  const response = await request('product/delete-image/{productImageId}', { method: 'DELETE', params: { productImageId: imageId } })
  form.value.product_images = unwrapList(response)
}

function normalizeProduct(response: any) {
  return response?.data || response || {}
}

function setFile(key: string, event: Event) {
  const input = event.target as HTMLInputElement
  form.value[key] = input.multiple ? Array.from(input.files || []) : input.files?.[0] || null
}

function addInventory() {
  inventories.value.push({ sku: '', quantity: 0, price: 0, values: [] })
}

function removeInventory(index: number) {
  inventories.value.splice(index, 1)
}

function imageUrl(image?: string) {
  if (!image) return ''
  if (/^https?:\/\//.test(image)) return image
  const base = String(config.public.adminApiBase || 'http://localhost:8000').replace(/\/+$/, '')
  return `${base}/uploads/${image}`
}
</script>

<template>
  <section class="product-editor">
    <div class="page-heading">
      <div>
        <p class="eyebrow">{{ isNew ? 'Create' : 'Edit' }}</p>
        <h2>Product form</h2>
      </div>
      <NuxtLink class="ghost-btn" to="/products">Back to list</NuxtLink>
    </div>

    <p v-if="error" class="error-box">{{ error }}</p>
    <div v-if="loading" class="empty-state">Loading...</div>

    <form v-else class="product-edit-grid" @submit.prevent="saveProduct">
      <div class="product-main-panel">
        <div v-if="form.flash_sale_product?.length" class="notice-box">
          This product is assigned in flash sale:
          {{ form.flash_sale_product.map((item: any) => item.flash_sale?.title).filter(Boolean).join(', ') }}
        </div>

        <div class="form-grid">
          <FormFormField :field="{ key: 'title', label: 'Title', required: true }" :model-value="form.title" @update:model-value="form.title = $event" />
          <FormFormField :field="{ key: 'slug', label: 'Slug', required: true }" :model-value="form.slug" @update:model-value="form.slug = $event" />
          <FormFormField :field="{ key: 'purchased', label: 'Purchased', type: 'number', required: true }" :model-value="form.purchased" @update:model-value="form.purchased = $event" />
          <FormFormField :field="{ key: 'selling', label: 'Selling', type: 'number', required: true }" :model-value="form.selling" @update:model-value="form.selling = $event" />
          <FormFormField :field="{ key: 'offered', label: 'Offered', type: 'number' }" :model-value="form.offered" @update:model-value="form.offered = $event" />

          <label class="field wide">
            <span>Categories</span>
            <select v-model="selectedCategories" multiple size="5">
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.title }}</option>
            </select>
          </label>
          <label class="field">
            <span>Primary category</span>
            <select v-model="form.primary_category_id">
              <option value="">Choose</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.title }}</option>
            </select>
          </label>
          <FormFormField :field="{ key: 'unit', label: 'Unit', required: true }" :model-value="form.unit" @update:model-value="form.unit = $event" />
          <FormFormField :field="{ key: 'badge', label: 'Badge' }" :model-value="form.badge" @update:model-value="form.badge = $event" />
          <FormFormField :field="{ key: 'overview', label: 'Overview', type: 'richtext', wide: true, required: true }" :model-value="form.overview" @update:model-value="form.overview = $event" />
          <FormFormField :field="{ key: 'description', label: 'Description', type: 'richtext', wide: true, required: true }" :model-value="form.description" @update:model-value="form.description = $event" />
          <FormFormField :field="{ key: 'status', label: 'Status', type: 'select', options: [{ label: 'Public', value: 1 }, { label: 'Private', value: 2 }] }" :model-value="form.status" @update:model-value="form.status = $event" />
          <label class="field">
            <span>Brand</span>
            <select v-model="form.brand_id">
              <option value="">Choose</option>
              <option v-for="brand in brands" :key="brand.id" :value="brand.id">{{ brand.title }}</option>
            </select>
          </label>
          <FormFormField :field="{ key: 'tags', label: 'Tags (optional)', wide: true, hint: 'Comma separated' }" :model-value="form.tags" @update:model-value="form.tags = $event" />
          <label class="field">
            <span>Tax rule</span>
            <select v-model="form.tax_rule_id" required>
              <option value="">Choose</option>
              <option v-for="rule in taxRules" :key="rule.id" :value="rule.id">{{ rule.title }}</option>
            </select>
          </label>
          <label class="field">
            <span>Shipping rule</span>
            <select v-model="form.shipping_rule_id" required>
              <option value="">Choose</option>
              <option v-for="rule in shippingRules" :key="rule.id" :value="rule.id">{{ rule.title }}</option>
            </select>
          </label>
          <label class="field">
            <span>Bundle deal</span>
            <select v-model="form.bundle_deal_id">
              <option value="">None</option>
              <option v-for="deal in bundleDeals" :key="deal.id" :value="deal.id">{{ deal.title }}</option>
            </select>
          </label>
          <label class="field wide">
            <span>Product collection</span>
            <select v-model="selectedCollections" multiple size="4">
              <option v-for="collection in collections" :key="collection.id" :value="collection.id">{{ collection.title }}</option>
            </select>
          </label>
          <FormFormField :field="{ key: 'refundable', label: 'Refundable', type: 'checkbox' }" :model-value="form.refundable" @update:model-value="form.refundable = $event" />
          <FormFormField :field="{ key: 'warranty', label: 'Warranty' }" :model-value="form.warranty" @update:model-value="form.warranty = $event" />
          <FormFormField :field="{ key: 'meta_title', label: 'Meta title', required: true }" :model-value="form.meta_title" @update:model-value="form.meta_title = $event" />
          <FormFormField :field="{ key: 'meta_keywords', label: 'Meta keywords', type: 'textarea', wide: true }" :model-value="form.meta_keywords" @update:model-value="form.meta_keywords = $event" />
          <FormFormField :field="{ key: 'meta_description', label: 'Meta description', type: 'textarea', wide: true, required: true }" :model-value="form.meta_description" @update:model-value="form.meta_description = $event" />
        </div>

        <div class="form-actions">
          <button class="primary-btn" type="submit" :disabled="saving || !can('product', isNew ? 'create' : 'edit')">
            {{ saving ? 'Saving...' : 'Save & edit' }}
          </button>
          <button class="primary-btn" type="submit" :disabled="saving || !can('product', isNew ? 'create' : 'edit')">Save</button>
        </div>
      </div>

      <aside class="product-side-panel">
        <div class="upload-card">
          <h3>Preview video <small>(Max size: 2mb)</small></h3>
          <p>{{ form.video ? form.video : 'No Video' }}</p>
          <input type="file" accept="video/*" @change="setFile('video_file', $event)">
          <input type="file" accept="image/*" @change="setFile('video_thumb_file', $event)">
          <button class="ghost-btn block" type="button" :disabled="uploadBusy === 'video' || !productId" @click="uploadVideo()">
            {{ uploadBusy === 'video' ? 'Uploading...' : 'Upload' }}
          </button>
        </div>

        <div class="upload-card">
          <h3>Preview image <small>(Suggested 1:1)</small></h3>
          <img v-if="form.image" :src="imageUrl(form.image)" alt="" class="product-preview-image">
          <p v-else>No Image found</p>
          <input type="file" accept="image/*" @change="setFile('image_file', $event)">
          <button class="ghost-btn block" type="button" :disabled="uploadBusy === 'image' || !productId" @click="uploadMainImage()">
            {{ uploadBusy === 'image' ? 'Uploading...' : 'Upload' }}
          </button>
        </div>

        <div class="upload-card">
          <h3>Product images <small>(Suggested 1:1)</small></h3>
          <div v-if="form.product_images?.length" class="gallery-grid">
            <div v-for="image in form.product_images" :key="image.id" class="gallery-item">
              <img :src="imageUrl(image.image)" alt="">
              <button type="button" class="danger-btn" @click="deleteProductImage(image.id)">Delete</button>
            </div>
          </div>
          <p v-else>No Image found</p>
          <input type="file" accept="image/*" multiple @change="setFile('gallery_files', $event)">
          <button class="ghost-btn block" type="button" :disabled="uploadBusy === 'gallery' || !productId" @click="uploadGallery()">
            {{ uploadBusy === 'gallery' ? 'Uploading...' : 'Upload images' }}
          </button>
        </div>
      </aside>
    </form>

    <section class="resource-page product-inventory-panel">
      <div class="panel-heading">
        <h3>Product inventory</h3>
        <button class="small-btn" type="button" @click="addInventory">Add inventory</button>
      </div>
      <p v-if="inventoryError" class="error-box">{{ inventoryError }}</p>
      <div v-for="(inv, index) in inventories" :key="inv.id || index" class="inventory-row">
        <input v-model="inv.sku" placeholder="SKU" class="inline-input">
        <input v-model.number="inv.quantity" type="number" placeholder="Quantity" class="inline-input">
        <input v-model.number="inv.price" type="number" placeholder="Extra price" class="inline-input">
        <button class="danger-btn" type="button" @click="removeInventory(index)">Remove</button>
      </div>
      <p v-if="!inventories.length" class="empty-state">No inventory variants yet.</p>
    </section>
  </section>
</template>
