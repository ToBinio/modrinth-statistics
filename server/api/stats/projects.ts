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
			query.mode as "all" | "major" | "minor",
			query.type,
			query.exclusive === "true",
			typeFn,
			query.versionTo,
			query.versionFrom,
		);
	},
	{ maxAge: 60 * 60 /* 1 hour */ },
);
