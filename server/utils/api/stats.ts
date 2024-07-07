import consola from "consola";
import type { Stats, StatsValue } from "~/server/utils/types/stats";
import type { ProjectTypes } from "~/utils/project";
import { firstLetterUpperCase } from "~/utils/text";

export type StatExport = {
	labels: string[];
	data: {
		label: string;
		backgroundColor: string;
		data: number[];
	}[];
};

export async function exportStats(
	mode: string,
	type: ProjectTypes,
	exclusive: boolean,
	fn: (value: StatsValue) => number,
): Promise<StatExport> {
	const storage = useStorage("statistics");

	let key = `${type}Stats${firstLetterUpperCase(mode)}`;

	if (exclusive) {
		key += "Exclusive";
	}

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
