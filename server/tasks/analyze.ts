import { updateGameVersions } from "~~/server/utils/processing/gameVersions/processing";
import { updateGlobalStats } from "~~/server/utils/processing/global/processing";
import { updateStatistics } from "~~/server/utils/processing/projects/processing";
import { DB } from "../utils/db/sql";
import { updateConnections } from "../utils/processing/connections/processing";
import { LOGGER } from "../utils/processing/logging";

export default defineTask({
	meta: {
		name: "analyze",
		description: "Update all the statistics",
	},
	async run() {
		const latestDate = await KV.LatestDate.getNotCached();
		if (latestDate === dateToKey(new Date())) {
			LOGGER.debug("data already analyzed");
			return { result: "Fail" };
		}

		const start = new Date();
		LOGGER.info("starting analyze - at", start.toISOString());
		try {
			//TODO: do something less destructive...
			await DB.clear();
			await updateConnections();

			await updateGameVersions();
			await updateStatistics();
			await updateGlobalStats();

			await KV.LatestDate.set(new Date());
		} catch (e) {
			LOGGER.fail(e);
		}
		const elapsed = Date.now() - start.getTime();
		LOGGER.info("analyze took", elapsed / 1000, "s");

		return { result: "Success" };
	},
});
