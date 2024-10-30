export function useTypeCategory(projectType: Ref<string>) {
	const isProjectStats = computed(() => {
		return [
			"mod",
			"plugin",
			"datapack",
			"shader",
			"resourcepack",
			"modpack",
		].includes(projectType.value);
	});

	const isGlobalStats = computed(() => {
		return ["projects", "versions", "authors", "files"].includes(
			projectType.value,
		);
	});

	const isRevenueStats = computed(() => {
		return ["revenue"].includes(projectType.value);
	});

	return { isGlobalStats, isRevenueStats, isProjectStats };
}
