type Data = {
	projects: number;
	versions: number;
	files: number;
	authors: number;
};

export default defineEventHandler(async (event): Promise<Data> => {
	const query = getQuery(event);

	const storage = useStorage("statistics");

	const dateKey = await storage.getItem<string>("latestDate");
	const gameVersions = await storage.getItem<Data>(`globalStats${dateKey}`);

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
