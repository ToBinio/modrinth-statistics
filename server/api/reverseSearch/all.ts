import type { ProjectData } from "~~/server/utils/processing/connections/types";

export default defineEventHandler(async (event): Promise<ProjectData[]> => {
	const query = getQuery(event);

	const projectIds = await DB.getAllForProject(
		query.id as string,
		parseInt(query.offset as string, 10),
		parseInt(query.limit as string, 10),
	);

	if (projectIds instanceof Error) {
		setResponseStatus(event, 500);
		return [];
	}

	return projectIds;
});
