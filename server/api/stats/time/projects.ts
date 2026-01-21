import { z } from "zod";
import type { StatExport } from "~~/shared/types/types";
import { ZProjectTypes } from "~~/shared/utils/project";

const querySchema = z.object({
	stat: ZProjectStatCategory,
	mode: ZVersionCategories,
	type: ZProjectTypes,
	exclusive: z.string(),
	version: z.string(),
	days: z.string().optional(),
	aggregate: z.string(),
});

export default defineCachedEventHandler(
	async (event): Promise<StatExport> => {
		const query = querySchema.safeParse(getQuery(event));
		if (!query.success) {
			throw createError({
				statusCode: 400,
				statusMessage: "Invalid query parameters",
				message: query.error.message,
			});
		}

		const typeFn = statStringToExtraction(query.data.stat);
		const days = query.data.days ? parseInt(query.data.days, 10) : undefined;

		const data = await exportStatsOverTime(
			query.data.mode,
			query.data.type,
			query.data.exclusive === "true",
			new Date(),
			query.data.version,
			typeFn,
			days,
		);

		const dataPoints = Math.min(64, days ?? 64);

		if (query.data.aggregate === "false") {
			return summarize(fracture(data), dataPoints, false);
		}
		return summarize(data, dataPoints, true);
	},
	{ maxAge: 60 * 60 * 4 /* 4 hour */, swr: false },
);
