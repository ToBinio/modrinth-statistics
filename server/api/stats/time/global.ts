import consola from "consola";

type QueryData = {
	type: GlobalStatCategory;
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

		return exportGlobalStatsOverTime(dateKey, typeFn);
	},
	{ maxAge: 60 * 60 /* 1 hour */ },
);
