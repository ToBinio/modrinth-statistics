export default defineEventHandler(async (event): Promise<string | null> => {
	const gameVersions = await KV.LatestDate.get();

	if (gameVersions instanceof Error) {
		setResponseStatus(event, 500);
		return null;
	}

	return gameVersions;
});
