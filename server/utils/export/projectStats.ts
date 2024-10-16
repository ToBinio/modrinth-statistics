import consola from "consola";
import type {
	ProjectStats,
	ProjectStatsValue,
} from "~~/server/utils/processing/projects/types";
import { dateToKey, keyToDate } from "~~/utils/date";

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

// maps database data to a format usable by the frontend
function mapStats(
	stats: ProjectStats,
	fn: (value: ProjectStatsValue) => number,
) {
	return {
		labels: stats.versions,
		data: stats.data.map((value) => {
			return {
				label: value.name,
				backgroundColor: getColorForLauncher(value.name),
				data: value.values.map((stat) => {
					if (stat === undefined) return 0;

					return fn(stat);
				}),
			};
		}),
	};
}

// extract only versions in the given version range
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
	fn: (value: ProjectStatsValue) => number,
	versionTo: string | null,
	versionFrom: string | null,
): Promise<StatExport> {
	const key = getStorageKey(type, versionCategory, exclusive, dateKey);

	const storage = useStorage("statistics");
	const stats = await storage.getItem<ProjectStats>(key);

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

export async function exportStatsOverTime(
	versionCategory: string,
	type: ProjectTypes,
	exclusive: boolean,
	firstDateKey: string,
	version: string,
	fn: (value: ProjectStatsValue) => number,
): Promise<StatExport> {
	const storage = useStorage("statistics");

	const statsOverTime: ProjectStats = {
		versions: [],
		data: [],
	};

	const date = keyToDate(firstDateKey);

	while (true) {
		const dateKey = dateToKey(date);
		const key = getStorageKey(type, versionCategory, exclusive, dateKey);
		const stats = await storage.getItem<ProjectStats>(key);

		if (!stats) {
			break;
		}

		const index = stats.versions.indexOf(version);

		statsOverTime.versions.splice(0, 0, dateKey);

		outer: for (const data of stats.data) {
			for (const dataOverTime of statsOverTime.data) {
				if (dataOverTime.name === data.name) {
					dataOverTime.values.splice(0, 0, data.values[index]);
					continue outer;
				}
			}

			statsOverTime.data.push({
				name: data.name,
				values: [data.values[index]],
			});
		}

		date.setUTCDate(date.getUTCDate() - 1);
	}

	return mapStats(statsOverTime, fn);
}
