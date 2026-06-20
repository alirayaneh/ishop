<script setup lang="ts">
const { request } = useAdminApi()
const ui = useAdminUiStore()

const now = new Date()
const selectedMonth = ref(now.getMonth() + 1)
const selectedYear = ref(now.getFullYear())
const orderType = ref('all')
const loading = ref(true)
const error = ref('')
const dashboard = ref<Record<string, any>>({})
const chartData = ref<any[]>([])
const statistics = ref<Record<string, any>>({})

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const tr = (path: string, fallback: string) => ui.t(path, fallback)

const cards = computed(() => [
  {
    label: tr('index.tProduct', 'Total products'),
    value: dashboard.value.products || 0,
    className: 'soft-yellow',
    icon: 'box'
  },
  {
    label: tr('index.tUsers', 'Total users'),
    value: dashboard.value.users || 0,
    className: 'soft-mint',
    icon: 'user'
  },
  {
    label: tr('index.tOrders', 'Total orders'),
    value: dashboard.value.orders || 0,
    className: 'soft-rose',
    icon: 'bag'
  },
  {
    label: tr('index.totalSell', 'Total sales'),
    value: `${dashboard.value.orders_amount || 0}${ui.currencyIcon}`,
    className: 'soft-blue',
    icon: 'receipt'
  }
])

const orderStats = computed(() => {
  const rows = statistics.value.statistics || []
  const byStatus = Object.fromEntries(rows.map((item: any) => [Number(item.status), item.total || 0]))

  return [
    { label: tr('index.orderCan', 'Cancelled orders'), value: statistics.value.cancelled || 0 },
    { label: tr('index.orderPend', 'Pending orders'), value: byStatus[1] || 0 },
    { label: tr('index.orderConf', 'Confirmed orders'), value: byStatus[2] || 0 },
    { label: tr('index.packPick', 'Package picked'), value: byStatus[3] || 0 },
    { label: tr('index.onWay', 'On the way'), value: byStatus[4] || 0 },
    { label: tr('index.delivered', 'Delivered'), value: byStatus[5] || 0 }
  ]
})

const maxChartValue = computed(() => {
  const values = chartData.value.map((item: any) => Number(item.total || item.amount || item.sell || 0))
  return Math.max(1, ...values)
})

const chartPoints = computed(() => {
  const days = new Date(selectedYear.value, selectedMonth.value, 0).getDate()
  const byDay = new Map(chartData.value.map((item: any) => [Number(item.day || item.date || item.order_day), Number(item.total || item.amount || item.sell || 0)]))

  return Array.from({ length: days }, (_, index) => {
    const day = index + 1
    const value = byDay.get(day) || 0
    const x = 28 + (index * (920 / Math.max(1, days - 1)))
    const y = 230 - (value / maxChartValue.value) * 185
    return { day, value, x, y }
  })
})

const chartPath = computed(() => {
  if (!chartPoints.value.length) return ''
  return chartPoints.value.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(' ')
})

async function loadShellData() {
  const profileResponse: any = await request('profile', { query: { lang: ui.language } })
  const profile = profileResponse?.data || profileResponse
  ui.setProfile(profile)

  const locale = profile?.default_language?.code || ui.language
  const localizationResponse: any = await request('localization', { query: { locale_code: locale } })
  ui.setTranslations(localizationResponse?.data || localizationResponse || {})
}

async function loadDashboard() {
  loading.value = true
  error.value = ''

  try {
    await loadShellData()

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Tehran'
    const [dashboardResponse, statisticsResponse]: any[] = await Promise.all([
      request('dashboard', {
        query: {
          year: selectedYear.value,
          month: selectedMonth.value,
          order_type: orderType.value,
          time_zone: timeZone,
          dashboard: false
        }
      }),
      request('order-statistic', {
        query: {
          order_type: orderType.value,
          time_zone: timeZone
        }
      })
    ])

    dashboard.value = dashboardResponse?.data?.dashboard || {}
    chartData.value = dashboardResponse?.data?.chart_data?.monthly_order || []
    statistics.value = statisticsResponse?.data || {}
  } catch (caught: any) {
    error.value = caught?.data?.message || caught?.message || 'Could not load dashboard'
  } finally {
    loading.value = false
  }
}

watch([selectedMonth, selectedYear, orderType], loadDashboard, { immediate: true })
</script>

<template>
  <section class="dashboard-page">
    <p v-if="error" class="error-box">{{ error }}</p>

    <AdminDashboardMetricGrid :cards="cards" />

    <AdminDashboardSalesChart
      v-model="selectedMonth"
      :year="selectedYear"
      :months="months"
      :points="chartPoints"
      :path="chartPath"
      :loading="loading"
    />

    <AdminDashboardOrderStats
      v-model="orderType"
      :title="tr('index.orderStat', 'Order statistics')"
      :items="orderStats"
    />

    <div class="split-grid">
      <AdminDashboardTopListPanel
        :title="tr('index.topCat', 'Top category')"
        :items="statistics.categories || []"
        empty-text="چیزی پیدا نشد"
      />

      <AdminDashboardTopListPanel
        :title="tr('index.topBra', 'Top brand')"
        :items="statistics.brands || []"
        empty-text="چیزی پیدا نشد"
      />
    </div>

    <AdminDashboardTopListPanel
      :title="tr('index.topPro', 'Top products')"
      :items="statistics.products || []"
      empty-text="چیزی پیدا نشد"
      :value-suffix="ui.currencyIcon"
    />
  </section>
</template>
