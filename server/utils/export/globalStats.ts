import type { GlobalStats } from "~~/server/utils/processing/global/types";
import { getGlobalStatsBulk } from "~~/server/utils/storage";

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

	let date = keyToDate(firstDateKey);

	const BULK_COUNT = 25;

	outer: while (true) {
		const dates = [];
		for (let i = 0; i < BULK_COUNT; i++) {
			dates.push(date);

			const new_date = new Date(date);
			new_date.setUTCDate(date.getUTCDate() - 1);

			date = new_date;
		}

		const data = await getGlobalStatsBulk(dates);

		for (let i = 0; i < data.length; i++) {
			const stats = data[i]!;
			const date = dates[i]!;

			if (stats instanceof Error) {
				break outer;
			}

			statsOverTime.labels.splice(0, 0, dateToFormatted(date));
			statsOverTime.data[0]?.data.splice(0, 0, fn(stats));
		}
	}

	return statsOverTime;
}
