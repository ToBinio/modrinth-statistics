import { z } from "zod";
import { exportStats } from "~~/server/utils/api/export/projectStats";
import { statStringToExtraction } from "~~/server/utils/api/project";

const querySchema = z.object({
	stat: ZProjectStatCategory,
	mode: ZVersionCategories,
	type: ZProjectTypes,
	exclusive: z.string(),
	versionFrom: z.string().optional(),
	versionTo: z.string().optional(),
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

		return exportStats(
			query.data.mode,
			query.data.type,
			query.data.exclusive === "true",
			typeFn,
			query.data.versionTo,
			query.data.versionFrom,
		);
	},
	{ maxAge: 60 * 60 * 4 /* 4 hour */, swr: false },
);
