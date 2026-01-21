import { exportRevenueStatsOverTime } from "~~/server/utils/api/export/revenue";
import type { StatExport } from "~~/shared/types/types";

export default defineCachedEventHandler(
	async (_event): Promise<StatExport> => {
		var data = await exportRevenueStatsOverTime();
		return data;
	},
	{ maxAge: 60 * 60 * 4 /* 4 hour */, swr: false },
);
