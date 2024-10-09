import consola from "consola";
import { exportGlobalStatsOverTime } from "~~/server/utils/api/stats";

type QueryData = {
	stat: "versions" | "count" | "downloads";
	mode: string;
	type: ProjectTypes;
	exclusive: string;
	version: string;
};

export default defineCachedEventHandler(
	async (event): Promise<StatExport> => {
		const query = getQuery<QueryData>(event);

		const storage = useStorage("statistics");
		const dateKey = await storage.getItem<string>("latestDate");

		if (!dateKey) {
			consola.error("no latestDate set");

			return {
				labels: [],
				data: [],
			};
		}

		let typeFn: (value: StatsValue) => number;

		switch (query.stat) {
			case "versions": {
				typeFn = (value) => value.versions;
				break;
			}
			case "count": {
				typeFn = (value) => value.count;
				break;
			}
			default: {
				typeFn = (value) => value.downloads;
				break;
			}
		}

		return exportStatsOverTime(
			query.mode,
			query.type,
			query.exclusive === "true",
			dateKey,
			query.version,
			typeFn,
		);
	},
	{ maxAge: 60 * 60 /* 1 hour */ },
);
