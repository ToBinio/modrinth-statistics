import { z } from "zod";

const querySchema = z.object({
	id: z.string(),
});

export default defineCachedEventHandler(
	async (event): Promise<{ count: number }> => {
		const query = querySchema.safeParse(getQuery(event));
		if (!query.success) {
			throw createError({
				statusCode: 400,
				statusMessage: "Invalid query parameters",
				message: query.error.message,
			});
		}

		const count = await DB.getCountForProject(query.data.id);

		if (count instanceof Error) {
			setResponseStatus(event, 500);
			return { count: 0 };
		}

		return { count: count };
	},
	{ maxAge: 60 * 60 * 4 /* 4 hour */, swr: false },
);
