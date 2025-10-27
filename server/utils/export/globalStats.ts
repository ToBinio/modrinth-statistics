import type { GlobalStats } from "~~/server/utils/processing/global/types";

export async function exportGlobalStatsOverTime(
	firstDateKey: string,
	fn: (value: GlobalStats) => number,
	max_days: number | undefined,
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
	let days_to_fetch_left = max_days ?? Number.MAX_SAFE_INTEGER;

	outer: while (days_to_fetch_left > 0) {
		const dates = [];
		for (let i = 0; i < Math.min(BULK_COUNT, days_to_fetch_left); i++) {
			dates.push(date);

			const new_date = new Date(date);
			new_date.setUTCDate(date.getUTCDate() - 1);

			date = new_date;
		}

		const data = await DB.GlobalStats.getBulk(dates);

		days_to_fetch_left -= data.length;

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
