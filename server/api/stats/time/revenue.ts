import type { GlobalStatCategory } from "~~/server/utils/processing/global/types";
import {exportRevenueStatsOverTime} from "~~/server/utils/export/revenue";

type QueryData = {
	type: GlobalStatCategory;
};

export default defineCachedEventHandler(
	async (event): Promise<StatExport> => {
		return exportRevenueStatsOverTime();
	},
	{ maxAge: 60 * 60 /* 1 hour */, swr: false },
);
