import type { GlobalStatCategory } from "~~/server/utils/processing/global/types";

type QueryData = {
	type: GlobalStatCategory;
};

export default defineCachedEventHandler(
	async (event): Promise<StatExport> => {
		return exportRevenueStatsOverTime();
	},
	{ maxAge: 60 * 60 /* 1 hour */ },
);
