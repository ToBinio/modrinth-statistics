import type { GlobalStats } from "~~/server/utils/processing/global/types";

export default defineEventHandler(async (event): Promise<GlobalStats> => {
	const query = getQuery(event);

	const storage = useStorage("statistics");

	const dateKey = await storage.getItem<string>("latestDate");
	const gameVersions = await storage.getItem<GlobalStats>(
		`globalStats${dateKey}`,
	);

	if (!gameVersions) {
		setResponseStatus(event, 500);
		return {
			projects: 0,
			versions: 0,
			files: 0,
			authors: 0,
		};
	}

	return gameVersions;
});
