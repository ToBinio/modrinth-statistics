<script setup lang="ts">
import {Bar} from 'vue-chartjs'
import type {StatExport} from "~/server/utils/api/stats";

const props = defineProps<{ url: string, mode: string }>();

const {data} = await useFetch<StatExport>(props.url, {query: {mode: props.mode}});
let downloadData = computed(() => {
  if (data.value) {
    return data.value
  }

  return {
    labels: [],
    data: []
  }
})

const chartData = computed(() => {
  return {
    labels: downloadData.value.labels,
    datasets: downloadData.value.data
  }
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: true,
      grid: {
        color: "#1b1a1e"
      },
      ticks: {
        color: "#8a8a8c"
      }
    },
    y: {
      stacked: true,
      grid: {
        color: "#1b1a1e"
      },

      ticks: {
        color: "#8a8a8c"
      }
    }
  },
  plugins: {
    legend: {
      labels: {
        color: "#8a8a8c"
      }
    }
  }
})
</script>

<template>
  <Bar
      :data="chartData"
      :options="chartOptions"
  />
</template>
<style scoped>
</style>