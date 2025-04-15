import { getRevenue } from "~~/server/utils/processing/revenue";

export async function exportRevenueStatsOverTime(): Promise<StatExport> {
	const statsOverTime: StatExport = {
		labels: [],
		data: [
			{
				label: "creator",
				backgroundColor: "#7ab0ee",
				data: [],
			},
			{
				label: "modrinth",
				backgroundColor: "#a5e388",
				data: [],
			},
		],
	};

	for (const revenue of await getRevenue()) {
		statsOverTime.labels.splice(0, 0, dateToFormatted(revenue.time));

		statsOverTime.data[0]?.data.splice(0, 0, revenue.creator_revenue);
		statsOverTime.data[1]?.data.splice(0, 0, revenue.modrinth_revenue);
	}

	return statsOverTime;
}
