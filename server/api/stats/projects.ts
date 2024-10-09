import consola from "consola";

type QueryData = {
	stat: "versions" | "count" | "downloads";
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
