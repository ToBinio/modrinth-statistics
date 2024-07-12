import { useSettings } from "~/composables/useSettings";

export function useVersionRange() {
	const { version, versionTo, versionFrom } = useSettings();

	const { data } = useFetch("/api/gameVersions", {
		query: { mode: version },
	});

	const versionNames = computed(() => {
		if (!data.value) {
			return [];
		}

		return data.value.map((value) => {
			return value.name;
		});
	});

	const to = computed(() => {
		if (!versionFrom.value) {
			return versionNames.value;
		}

		const index = versionNames.value.indexOf(versionFrom.value);

		return versionNames.value.slice(index, versionNames.value.length);
	});

	const from = computed(() => {
		if (!versionTo.value) {
			return versionNames.value;
		}

		const index = versionNames.value.indexOf(versionTo.value);

		return versionNames.value.slice(0, index + 1);
	});

	return { from, to };
}
