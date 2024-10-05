export async function useGameVersions(versionGroup: Ref<string | undefined>) {
	const { data } = await useFetch("/api/gameVersions", {
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
