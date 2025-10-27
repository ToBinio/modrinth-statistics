import consola from "consola";
import { exportGlobalStatsOverTime } from "~~/server/utils/export/globalStats";
import { fracture } from "~~/server/utils/processing/aggregate";
import type { GlobalStatCategory } from "~~/server/utils/processing/global/types";

type QueryData = {
	type: GlobalStatCategory;
	days: number | undefined;
	aggregate: string;
};

export default defineCachedEventHandler(
	async (event): Promise<StatExport> => {
		const query = getQuery<QueryData>(event);

		const dateKey = await DB.LatestDate.get();

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

		const data = await exportGlobalStatsOverTime(dateKey, typeFn, query.days);

		const dataPoints = Math.min(64, query.days ?? 64);
		if (query.aggregate === "false") {
			return summarize(fracture(data), dataPoints, false);
		}
		return summarize(data, dataPoints, true);
	},
	{ maxAge: 60 * 60 * 4 /* 4 hour */, swr: false },
);
