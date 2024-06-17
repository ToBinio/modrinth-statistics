<script setup lang="ts">
import {Bar} from 'vue-chartjs'

const {data} = await useFetch("/api/majorVersionDownloads");
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
  const datasets = downloadData.value.data.map((launcher) => {
    return {
      label: launcher.name,
      backgroundColor: launcher.color,
      data: launcher.downloads,
    }
  })

  return {
    labels: downloadData.value.labels,
    datasets: datasets
  }
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: true
    },
    y: {
      stacked: true
    }
  },
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