import consola from "consola";
import type { VersionCategories } from "~~/server/utils/processing/gameVersions/types";
import type {
	ProjectStats,
	ProjectStatsValue,
} from "~~/server/utils/processing/projects/types";
import {
	getLatestProjectStats,
	getProjectStats,
} from "~~/server/utils/storage";

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
	versionCategory: VersionCategories,
	type: ProjectTypes,
	exclusive: boolean,
	fn: (value: ProjectStatsValue) => number,
	versionTo: string | null,
	versionFrom: string | null,
): Promise<StatExport> {
	const stats = await getLatestProjectStats(type, versionCategory, exclusive);

	if (stats instanceof Error) {
		consola.error(stats.message);

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
	versionCategory: VersionCategories,
	type: ProjectTypes,
	exclusive: boolean,
	firstDate: Date,
	version: string,
	fn: (value: ProjectStatsValue) => number,
): Promise<StatExport> {
	const statsOverTime: ProjectStats = {
		versions: [],
		data: [],
	};

	const date = firstDate;

	while (true) {
		const stats = await getProjectStats(date, type, versionCategory, exclusive);

		if (stats instanceof Error) {
			break;
		}

		const index = stats.versions.indexOf(version);

		statsOverTime.versions.splice(0, 0, dateToFormatted(date));

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
