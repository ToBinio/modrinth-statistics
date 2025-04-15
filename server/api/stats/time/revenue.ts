import { exportRevenueStatsOverTime } from "~~/server/utils/export/revenue";

export default defineCachedEventHandler(
	async (_event): Promise<StatExport> => {
		return exportRevenueStatsOverTime();
	},
	{ maxAge: 60 * 60 /* 1 hour */, swr: false },
);
