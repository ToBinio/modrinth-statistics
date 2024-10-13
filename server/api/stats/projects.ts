import consola from "consola";
import type {
	ProjectStatCategory,
	ProjectStatsValue,
} from "~~/server/utils/processing/projects/types";

type QueryData = {
	stat: ProjectStatCategory;
	mode: string;
	type: ProjectTypes;
	exclusive: string;
	versionFrom: string | null;
	versionTo: string | null;
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

		let typeFn: (value: ProjectStatsValue) => number;

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

		return exportStats(
			query.mode,
			query.type,
			query.exclusive === "true",
			dateKey,
			typeFn,
			query.versionTo,
			query.versionFrom,
		);
	},
	{ maxAge: 60 * 60 /* 1 hour */ },
);
