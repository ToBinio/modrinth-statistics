export default defineEventHandler(async (event): Promise<string | null> => {
	const storage = useStorage("statistics");
	const gameVersions = await storage.getItem<string>("latestDate");

	if (!gameVersions) {
		setResponseStatus(event, 500);
		return null;
	}

	return gameVersions;
});
