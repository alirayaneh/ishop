<script setup lang="ts">
const props = defineProps<{
  modelValue: number
  year: number
  months: string[]
  points: Array<{ day: number; value: number; x: number; y: number }>
  path: string
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()
</script>

<template>
  <article class="dash-panel chart-panel">
    <div class="chart-toolbar">
      <div class="chart-legend"><span></span> Sell</div>
      <select :value="modelValue" @change="emit('update:modelValue', Number(($event.target as HTMLSelectElement).value))">
        <option v-for="(month, index) in months" :key="month" :value="index + 1">
          {{ month }}, {{ year }}
        </option>
      </select>
    </div>

    <div class="chart-wrap" :class="{ loading }">
      <svg viewBox="0 0 980 280" role="img" aria-label="Monthly sales chart">
        <g class="chart-grid">
          <line v-for="row in 7" :key="`r-${row}`" x1="28" x2="950" :y1="40 + row * 30" :y2="40 + row * 30" />
          <line v-for="point in points" :key="`g-${point.day}`" :x1="point.x" :x2="point.x" y1="50" y2="236" />
        </g>
        <path v-if="path" class="chart-line" :d="path" />
        <g class="chart-dots">
          <circle v-for="point in points" :key="point.day" :cx="point.x" :cy="point.y" r="2.5" />
        </g>
        <g class="chart-labels">
          <text v-for="point in points" :key="`label-${point.day}`" :x="point.x" y="260">{{ String(point.day).padStart(2, '0') }}</text>
        </g>
      </svg>
    </div>
  </article>
</template>
