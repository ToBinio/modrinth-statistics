export default defineCachedEventHandler(
	async (event): Promise<{ count: number }> => {
		const query = getQuery(event);

		const count = await DB.getCountForProject(query.id as string);

		if (count instanceof Error) {
			setResponseStatus(event, 500);
			return { count: 0 };
		}

		return { count: count };
	},
	{ maxAge: 60 * 60 * 4 /* 4 hour */, swr: false },
);
