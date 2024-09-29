import consola from "consola";

type QueryData = {
	stat: "versions" | "count" | "downloads";
	mode: string;
	type: ProjectTypes;
	exclusive: string;
	date: string | null;
	versionFrom: string | null;
	versionTo: string | null;
};

export default defineEventHandler(async (event): Promise<StatExport> => {
	const query = getQuery<QueryData>(event);

	let dateKey: string | null = query.date as string;

	if (!dateKey) {
		const storage = useStorage("statistics");
		dateKey = await storage.getItem<string>("latestDate");
	}

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
});
