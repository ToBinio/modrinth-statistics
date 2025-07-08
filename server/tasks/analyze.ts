import consola from "consola";
import { updateGameVersions } from "~~/server/utils/processing/gameVersions/processing";
import { updateGlobalStats } from "~~/server/utils/processing/global/processing";
import { updateStatistics } from "~~/server/utils/processing/projects/processing";

export default defineTask({
	meta: {
		name: "analyze",
		description: "Update all the statistics",
	},
	async run() {
		const latestDate = await DB.LatestDate.get();
		if (latestDate === dateToKey(new Date())) {
			consola.debug("data already analyzed");
			return { result: "Fail" };
		}

		consola.log("starting analyze");

		console.time("finish analyze");
		try {
			await updateGameVersions();
			await updateStatistics();
			await updateGlobalStats();
			await DB.LatestDate.set(new Date());
		} catch (e) {
			consola.fail(e);
		}
		console.timeEnd("finish analyze");

		return { result: "Success" };
	},
});
