import type { ProjectData } from "~~/server/utils/processing/connections/types";

type QueryData = {
	id: string;
	offset: string;
	limit: string;
};

export default defineCachedEventHandler(
	async (event): Promise<ProjectData[]> => {
		const query = getQuery<QueryData>(event);

		const projectIds = await DB.getAllForProject(
			query.id,
			parseInt(query.offset, 10),
			parseInt(query.limit, 10),
		);

		if (projectIds instanceof Error) {
			setResponseStatus(event, 500);
			return [];
		}

		return projectIds;
	},
	{ maxAge: 60 * 60 * 4 /* 4 hour */, swr: false },
);
