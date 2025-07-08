import consola from "consola";
import type { VersionCategories } from "~~/server/utils/processing/gameVersions/types";
import type {
	ProjectStats,
	ProjectStatsValue,
} from "~~/server/utils/processing/projects/types";

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
		const data = mappedStats.data[i];

		if (!data) continue;

		data.data = data.data.slice(from, to);
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
	const stats = await DB.ProjectStats.getLatest(
		type,
		versionCategory,
		exclusive,
	);

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
	max_days: number | undefined,
): Promise<StatExport> {
	const statsOverTime: ProjectStats = {
		versions: [],
		data: [],
	};

	let date = firstDate;

	const BULK_COUNT = 25;
	let days_to_fetch_left = max_days ?? Number.MAX_SAFE_INTEGER;

	outer: while (days_to_fetch_left > 0) {
		const dates = [];
		for (let i = 0; i < Math.min(BULK_COUNT, days_to_fetch_left); i++) {
			dates.push(date);

			const new_date = new Date(date);
			new_date.setUTCDate(date.getUTCDate() - 1);

			date = new_date;
		}

		const data = await DB.ProjectStats.getBulk(
			dates,
			type,
			versionCategory,
			exclusive,
		);

		days_to_fetch_left -= data.length;

		for (let i = 0; i < data.length; i++) {
			const stats = data[i]!;
			const date = dates[i];

			if (!date) {
				consola.error(`No date for '${stats}' found`);
				break outer;
			}

			if (stats instanceof Error) {
				break outer;
			}

			const versionIndex = stats.versions.indexOf(version);

			for (const data of stats.data) {
				const versionData = data.values[versionIndex];

				if (!versionData) break outer;

				const loaderIndex = statsOverTime.data.findIndex((loader) => {
					return loader.name === data.name;
				});

				if (loaderIndex !== -1) {
					statsOverTime.data[loaderIndex]!.values.splice(0, 0, versionData);
					continue;
				}

				statsOverTime.data.push({
					name: data.name,
					values: [versionData],
				});
			}

			statsOverTime.versions.splice(0, 0, dateToFormatted(date));
		}
	}

	return mapStats(statsOverTime, fn);
}
