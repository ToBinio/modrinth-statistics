export default defineEventHandler(async (event): Promise<string[]> => {
	const query = getQuery(event);

	const projectIds = await DB.getForProject(query.id as string);

	if (projectIds instanceof Error) {
		setResponseStatus(event, 500);
		return [];
	}

	return projectIds;
});
