import type { GameVersionData } from "~~/server/utils/processing/gameVersions/types";

export default defineEventHandler(async (event): Promise<GameVersionData> => {
	const query = getQuery(event);

	const gameVersions = await KV.GameVersions.get();

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
		case "minor": {
			return gameVersions.minor;
		}
		case "unified": {
			return gameVersions.unified;
		}
		default: {
			setResponseStatus(event, 400);
			return [];
		}
	}
});
