import consola from "consola";
import type { GlobalStats } from "~~/server/utils/processing/global/types";

export default defineCachedEventHandler(
	async (event): Promise<GlobalStats> => {
		const globalStats = await DB.GlobalStats.getLatest();

		if (globalStats instanceof Error) {
			consola.error(globalStats.message);
			setResponseStatus(event, 500);
			return {
				projects: 0,
				versions: 0,
				files: 0,
				authors: 0,
			};
		}

		return globalStats;
	},
	{ maxAge: 60 * 60 /* 1 hour */, swr: false },
);
