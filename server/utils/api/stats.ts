import consola from "consola";

export type StatExport = {
	labels: string[];
	data: {
		label: string;
		backgroundColor: string;
		data: number[];
	}[];
};

function getStorageKey(
	type: ProjectTypes,
	versionCategory: string,
	exclusive: boolean,
	dateKey: string,
) {
	// key format: <projectType>Stats<versionCategory><?exclusive><date>
	let key = `${type}Stats${firstLetterUpperCase(versionCategory)}`;

	if (exclusive) {
		key += "Exclusive";
	}

	key += dateKey;
	return key;
}

function mapStats(stats: Stats, fn: (value: StatsValue) => number) {
	return {
		labels: stats.versions,
		data: stats.data.map((value) => {
			return {
				label: value.name,
				backgroundColor: getColorForLauncher(value.name),
				data: value.values.map((stat) => {
					return fn(stat);
				}),
			};
		}),
	};
}

function filterVersions(
	mappedStats: StatExport,
	versionTo: string | null,
	versionFrom: string | null,
) {
	let to = mappedStats.labels.length;
	if (versionTo) {
		to = mappedStats.labels.indexOf(versionTo) + 1;
	}

	let from = 0;
	if (versionFrom) {
		from = mappedStats.labels.indexOf(versionFrom);
	}

	mappedStats.labels = mappedStats.labels.slice(from, to);

	for (let i = 0; i < mappedStats.data.length; i++) {
		mappedStats.data[i].data = mappedStats.data[i].data.slice(from, to);
	}
}

export async function exportStats(
	versionCategory: string,
	type: ProjectTypes,
	exclusive: boolean,
	dateKey: string,
	fn: (value: StatsValue) => number,
	versionTo: string | null,
	versionFrom: string | null,
): Promise<StatExport> {
	const key = getStorageKey(type, versionCategory, exclusive, dateKey);

	const storage = useStorage("statistics");
	const stats = await storage.getItem<Stats>(key);

	if (!stats) {
		consola.error(`could not find stats for key - "${key}"`);

		return {
			labels: [],
			data: [],
		};
	}
	const mappedStats = mapStats(stats, fn);

	filterVersions(mappedStats, versionTo, versionFrom);

	return mappedStats;
}
