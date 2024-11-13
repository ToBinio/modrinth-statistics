import consola from "consola";
import { updateGameVersions } from "~~/server/utils/processing/gameVersions/processing";
import { updateGlobalStats } from "~~/server/utils/processing/global/processing";
import { updateStatistics } from "~~/server/utils/processing/projects/processing";
import { getLatestDate, setLatestDate } from "~~/server/utils/storage";

export default defineTask({
	meta: {
		name: "analyze",
		description: "Update all the statistics",
	},
	async run() {
		const latestDate = await getLatestDate();
		if (latestDate === dateToKey(new Date())) {
			consola.debug("data already analyzed")
			return { result: "Fail" };
		}

		consola.log("starting analyze");

		console.time("finish analyze");
		try {
			await updateGameVersions();
			await updateStatistics();
			await updateGlobalStats();
			await setLatestDate(new Date());
		} catch (e) {
			consola.fail(e);
		}
		console.timeEnd("finish analyze");

		return { result: "Success" };
	},
});
