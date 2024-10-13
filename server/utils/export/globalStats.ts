import type { GlobalStats } from "~~/server/utils/processing/global/types";
import { dateToKey, keyToDate } from "~~/utils/date";

export async function exportGlobalStatsOverTime(
	firstDateKey: string,
	fn: (value: GlobalStats) => number,
): Promise<StatExport> {
	const storage = useStorage("statistics");

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
		const dateKey = dateToKey(date);
		const key = `globalStats${dateKey}`;
		const stats = await storage.getItem<GlobalStats>(key);

		if (!stats) {
			break;
		}

		statsOverTime.labels.splice(0, 0, dateKey);

		statsOverTime.data[0].data.splice(0, 0, fn(stats));

		date.setUTCDate(date.getUTCDate() - 1);
	}

	return statsOverTime;
}
