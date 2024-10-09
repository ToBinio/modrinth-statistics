import {
	BarElement,
	CategoryScale,
	Chart,
	Legend,
	LineElement,
	LinearScale,
	PointElement,
	Title,
	Tooltip,
} from "chart.js";

export default defineNuxtPlugin(() => {
	Chart.register(
		CategoryScale,
		LinearScale,
		LineElement,
		BarElement,
		Title,
		Tooltip,
		Legend,
		PointElement,
	);
});
