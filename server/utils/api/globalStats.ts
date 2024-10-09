import consola from "consola";
import { dateToKey, keyToDate } from "~~/utils/date";

export async function exportGlobalStatsOverTime(
	firstDateKey: string,
	fn: (value: GlobalStats) => number,
): Promise<StatExport> {
	const storage = useStorage("statistics");

	const statsOverTime: StatExport = {
		labels: [],
		data: [],
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

		statsOverTime.data.push({
			label: "data",
			backgroundColor: "#7ab0ee",
			data: [fn(stats)],
		});

		date.setUTCDate(date.getUTCDate() - 1);
	}

	return statsOverTime;
}
