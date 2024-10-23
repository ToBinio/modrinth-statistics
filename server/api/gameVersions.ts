import type { GameVersionData } from "~~/server/utils/processing/gameVersions/types";
import { getGameVersions } from "~~/server/utils/storage";

export default defineEventHandler(async (event): Promise<GameVersionData> => {
	const query = getQuery(event);

	const gameVersions = await getGameVersions();

	if (gameVersions instanceof Error) {
		setResponseStatus(event, 500);
		return [];
	}

	switch (query.mode) {
		case "all": {
			return gameVersions.all;
		}
		case "major": {
			return gameVersions.major;
		}
		default: {
			return gameVersions.minor;
		}
	}
});
