export function useGameVersions(versionGroup: Ref<string | undefined>) {
	const { data } = useFetch("/api/gameVersions", {
		query: { mode: versionGroup },
	});

	return computed(() => {
		if (!data.value) {
			return [];
		}

		return data.value.map((value) => {
			return value.name;
		});
	});
}
