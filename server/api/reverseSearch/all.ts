import { z } from "zod";
import type { ProjectData } from "~~/server/utils/processing/connections/types";

const querySchema = z.object({
	id: z.string(),
	offset: z.string(),
	limit: z.string(),
});

export default defineCachedEventHandler(
	async (event): Promise<ProjectData[]> => {
		const query = querySchema.safeParse(getQuery(event));
		if (!query.success) {
			throw createError({
				statusCode: 400,
				statusMessage: "Invalid query parameters",
				message: query.error.message,
			});
		}

		const projectIds = await DB.getAllForProject(
			query.data.id,
			parseInt(query.data.offset, 10),
			parseInt(query.data.limit, 10),
		);

		if (projectIds instanceof Error) {
			setResponseStatus(event, 500);
			return [];
		}

		return projectIds;
	},
	{ maxAge: 60 * 60 * 4 /* 4 hour */, swr: false },
);
