import { getLatestDate } from "~~/server/utils/storage";

export default defineEventHandler(async (event): Promise<string | null> => {
	const gameVersions = await getLatestDate();

	if (gameVersions instanceof Error) {
		setResponseStatus(event, 500);
		return null;
	}

	return gameVersions;
});
