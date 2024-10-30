import consola from "consola";
import { updateGameVersions } from "~~/server/utils/processing/gameVersions/processing";
import { updateGlobalStats } from "~~/server/utils/processing/global/processing";
import { updateStatistics } from "~~/server/utils/processing/projects/processing";
import { setLatestDate } from "~~/server/utils/storage";

export default defineTask({
	meta: {
		name: "analyze",
		description: "Update all the statistics",
	},
	async run() {
		consola.log("starting analyze");

		console.time("finish analyze");
		await updateGameVersions();
		await updateStatistics();
		await updateGlobalStats();
		await setLatestDate(new Date());
		console.timeEnd("finish analyze");

		return { result: "Success" };
	},
});
