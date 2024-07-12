<script setup lang="ts">
import { Bar } from "vue-chartjs";
import { useSettings } from "~/composables/useSettings";
import type { StatExport } from "~/server/utils/api/stats";

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
	},
});

const downloadData = computed(() => {
	if (data.value) {
		const chartData: StatExport = JSON.parse(JSON.stringify(data.value));

		let to = data.value.labels.length;
		if (versionTo.value) {
			to = chartData.labels.indexOf(versionTo.value) + 1;
		}

		let from = 0;
		if (versionFrom.value) {
			from = chartData.labels.indexOf(versionFrom.value);
		}

		chartData.labels = chartData.labels.slice(from, to);

		for (let i = 0; i < chartData.data.length; i++) {
			chartData.data[i].data = chartData.data[i].data.slice(from, to);
		}

		return chartData;
	}

	return {
		labels: [],
		data: [],
	};
});

const chartData = computed(() => {
	return {
		labels: downloadData.value.labels,
		datasets: downloadData.value.data.map((value) => {
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