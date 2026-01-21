import type { StatExport } from "~~/shared/types/types";

export function useStatData(
	isGlobalStats: Ref<boolean>,
	isRevenueStats: Ref<boolean>,
	time: Ref<string>,
	// biome-ignore lint: can be any
	params: Record<string, any>,
) {
	const url = computed(() => {
		if (isGlobalStats.value) {
			return "/api/stats/time/global";
		}

		if (isRevenueStats.value) {
			return "/api/stats/time/revenue";
		}

		return time.value === "today"
			? "/api/stats/projects"
			: "/api/stats/time/projects";
	});

	const { data, status } = useFetch<StatExport>(url, {
		query: params,
	});

	const isFetching = computed(() => status.value === "pending");

	return { data, isFetching };
}
