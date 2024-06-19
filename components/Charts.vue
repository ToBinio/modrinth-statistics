<script setup lang="ts">
import {Bar} from 'vue-chartjs'
import type {StatExport} from "~/server/utils/api/stats";

const props = defineProps<{ stat: string, type: string, mode: string, explanation: string }>();

const {data} = useFetch<StatExport>("/api/stats", {
  query: {
    mode: props.mode,
    type: props.type,
    stat: props.stat
  }
});
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
    datasets: downloadData.value.data.map((value) => {
      return {
        ...value,
        borderRadius: 3
      }
    })
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
        color: "#8a8a8c",
        useBorderRadius: true
      }
    }
  },
})
</script>

<template>
  <div id="container">
    <Bar
        :data="chartData"
        :options="chartOptions"
    />
  </div>
  <div id="tooltip">
    <Icon name="ph:question" size="25" style="color: var(--white)"/>
    <div id="explanation" v-html="explanation">
    </div>
  </div>
</template>
<style scoped>
#container {
  flex: 1;

  canvas {
    margin: 10px;
  }
}

#tooltip {
  position: absolute;

  top: 0;
  right: 10px;

  &:not(:hover) {
    #explanation {
      display: none;
    }
  }

  #explanation {
    position: absolute;
    right: 0;

    background-color: var(--surface-200);
    padding: 10px;
    border-radius: 10px;

    width: 400px;
    max-width: 90vw;
  }
}
</style>

<style>
#explanation {
  h4 {
    margin: 0;
  }
}
</style>