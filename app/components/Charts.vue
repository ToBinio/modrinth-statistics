<script setup lang="ts">
import { Bar } from "vue-chartjs";

const props = defineProps<{
	stat: string;
	type: string;
	explanation: string;
}>();
const { version, exclusive, versionFrom, versionTo } = useSettings();

const { data } = useFetch<StatExport>("/api/stats", {
	query: {
		mode: version,
		exclusive: exclusive,
		type: props.type,
		stat: props.stat,
		versionTo: versionTo,
		versionFrom: versionFrom,
	},
});

const chartData = computed(() => {
	if (!data.value) {
		return {
			labels: [],
			datasets: [],
		};
	}

	return {
		labels: data.value.labels,
		datasets: data.value.data.map((value) => {
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
				useBorderRadius: true,
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
    position: absolute;
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