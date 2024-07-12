import type { GameVersionData } from "../utils/gameVersions";

export default defineEventHandler(async (event): Promise<GameVersionData> => {
	const query = getQuery(event);

	const storage = useStorage("statistics");
	const gameVersions = await storage.getItem<GameVersions>("gameVersions");

	if (!gameVersions) {
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
