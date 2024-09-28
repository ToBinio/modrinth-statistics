import consola from "consola";

export type StatExport = {
	labels: string[];
	data: {
		label: string;
		backgroundColor: string;
		data: number[];
	}[];
};

export async function exportStats(
	versionCategory: string,
	type: ProjectTypes,
	exclusive: boolean,
	dateKey: string,
	fn: (value: StatsValue) => number,
): Promise<StatExport> {
	const storage = useStorage("statistics");

	// key format: <projectType>Stats<versionCategory><?exclusive><date>
	let key = `${type}Stats${firstLetterUpperCase(versionCategory)}`;

	if (exclusive) {
		key += "Exclusive";
	}

	key += dateKey;

	const stats = await storage.getItem<Stats>(key);

	if (!stats) {
		consola.error(`could not find stats for key - "${key}"`);

		return {
			labels: [],
			data: [],
		};
	}

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
