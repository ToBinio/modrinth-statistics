export function useStatData(
	isGlobalStats: Ref<boolean>,
	isRevenueStats: Ref<boolean>,
	time: Ref<string>,
	// biome-ignore lint: can be any
	params: Record<string, any>,
) {
	watch(
		() => Object.values(params).map((ref) => ref.value),
		() => {
			const unwrapped = Object.fromEntries(
				Object.entries(params).map(([key, ref]) => [key, ref.value]),
			);
			umTrackEvent("statsFilterChanged", unwrapped);
		},
	);

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

	const { data, status } = useFetch<StatExport>(url, {
		query: params,
	});

	const isFetching = computed(() => status.value === "pending");

	return { data, isFetching };
}
