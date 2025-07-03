import { exportRevenueStatsOverTime } from "~~/server/utils/export/revenue";

export default defineCachedEventHandler(
	async (_event): Promise<StatExport> => {
		var data = await exportRevenueStatsOverTime();
		return data;
	},
	{ maxAge: 60 * 60 /* 1 hour */, swr: false },
);
