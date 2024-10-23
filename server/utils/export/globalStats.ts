import type { GlobalStats } from "~~/server/utils/processing/global/types";
import { getGlobalStats } from "~~/server/utils/storage";
import { dateToFormatted, keyToDate } from "~~/utils/date";

export async function exportGlobalStatsOverTime(
	firstDateKey: string,
	fn: (value: GlobalStats) => number,
): Promise<StatExport> {
	const statsOverTime: StatExport = {
		labels: [],
		data: [
			{
				label: "data",
				backgroundColor: "#7ab0ee",
				data: [],
			},
		],
	};

	const date = keyToDate(firstDateKey);

	while (true) {
		const stats = await getGlobalStats(date);

		if (stats instanceof Error) {
			break;
		}

		statsOverTime.labels.splice(0, 0, dateToFormatted(date));
		statsOverTime.data[0].data.splice(0, 0, fn(stats));

		date.setUTCDate(date.getUTCDate() - 1);
	}

	return statsOverTime;
}
