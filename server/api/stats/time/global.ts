import consola from "consola";
import { exportGlobalStatsOverTime } from "~~/server/utils/export/globalStats";
import { fracture } from "~~/server/utils/processing/aggregate";
import type { GlobalStatCategory } from "~~/server/utils/processing/global/types";
import { getLatestDate } from "~~/server/utils/storage";

type QueryData = {
	type: GlobalStatCategory;
	aggregate: string;
};

export default defineCachedEventHandler(
	async (event): Promise<StatExport> => {
		const query = getQuery<QueryData>(event);

		const dateKey = await getLatestDate();

		if (dateKey instanceof Error) {
			consola.error("no latestDate set");

			return {
				labels: [],
				data: [],
			};
		}

		let typeFn: (value: {
			projects: number;
			versions: number;
			files: number;
			authors: number;
		}) => number;

		switch (query.type) {
			case "projects": {
				typeFn = (value) => value.projects;
				break;
			}
			case "versions": {
				typeFn = (value) => value.versions;
				break;
			}
			case "authors": {
				typeFn = (value) => value.authors;
				break;
			}
			default: {
				typeFn = (value) => value.files;
				break;
			}
		}

		const data = await exportGlobalStatsOverTime(dateKey, typeFn);

		if (query.aggregate === "false") {
			return summarize(fracture(data), 64, false);
		}
		return summarize(data, 64, true);
	},
	{ maxAge: 60 * 60 /* 1 hour */, swr: false },
);
