export function useStatData(
	isGlobalStats: Ref<boolean>,
	isRevenueStats: Ref<boolean>,
	time: Ref<string>,
	// biome-ignore lint:
	params: Record<string, any>,
) {
	const url = computed(() => {
		if (isGlobalStats.value) {
			return "/api/stats/time/global";
		}

		if (isRevenueStats.value) {
			return "/api/stats/time/revenue";
		}

		return time.value === "current"
			? "/api/stats/projects"
			: "/api/stats/time/projects";
	});

	const { data } = useFetch<StatExport>(url, {
		query: params,
	});

	return data;
}
