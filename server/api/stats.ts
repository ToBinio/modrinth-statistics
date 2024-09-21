export default defineEventHandler(async (event): Promise<StatExport> => {
	const query = getQuery(event);

	const mode = query.mode as string;
	const type = query.type as ProjectTypes;
	const exclusive = query.exclusive === "true";

	switch (query.stat) {
		case "versions": {
			return exportStats(mode, type, exclusive, (value) => value.versions);
		}
		case "count": {
			return exportStats(mode, type, exclusive, (value) => value.count);
		}
		default: {
			return exportStats(mode, type, exclusive, (value) => value.downloads);
		}
	}
});
