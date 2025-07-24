<script setup lang="ts">
import { Bar } from "vue-chartjs";

const props = defineProps<{
	data: StatExport | undefined;
}>();

const chartData = computed(() => {
	if (!props.data) {
		return {
			labels: [],
			datasets: [],
		};
	}

	return {
		labels: props.data.labels,
		datasets: props.data.data.map((value) => {
			return {
				...value,
				borderRadius: 3,
			};
		}),
	};
});

const chartOptions = ref({
	responsive: true,
	maintainAspectRatio: false,
	scales: {
		x: {
			stacked: true,
			grid: {
				color: "#1b1a1e",
			},
			ticks: {
				color: "#8a8a8c",
			},
		},
		y: {
			stacked: true,
			grid: {
				color: "#1b1a1e",
			},

			ticks: {
				color: "#8a8a8c",
			},
		},
	},
	plugins: {
		legend: {
			labels: {
				color: "#8a8a8c",
			},
		},
	},
});
</script>

<template>
  <div id="container">
    <Bar
        :data="chartData"
        :options="chartOptions"
    />
  </div>
</template>
<style scoped>
#container {
  flex: 1;

  canvas {
    position: absolute;
    margin: 10px;
  }
}

</style>