<script setup lang="ts">
import { Line } from "vue-chartjs";

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
				borderColor: value.backgroundColor,
				tension: 0.1,
			};
		}),
	};
});

const chartOptions = ref({
	responsive: true,
	maintainAspectRatio: false,
	scales: {
		x: {
			grid: {
				color: "#1b1a1e",
			},
			ticks: {
				color: "#8a8a8c",
			},
		},
		y: {
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
				useBorderRadius: true,
			},
		},
	},
});
</script>

<template>
  <div id="container">
    <Line
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