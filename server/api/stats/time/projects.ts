import { statStringToExtraction } from "~~/server/utils/api/project";
import { exportStatsOverTime } from "~~/server/utils/export/projectStats";
import type { VersionCategories } from "~~/server/utils/processing/gameVersions/types";
import type { ProjectStatCategory } from "~~/server/utils/processing/projects/types";

type QueryData = {
	stat: ProjectStatCategory;
	mode: string;
	type: ProjectTypes;
	exclusive: string;
	version: string;
};

export default defineCachedEventHandler(
	async (event): Promise<StatExport> => {
		const query = getQuery<QueryData>(event);
		const typeFn = statStringToExtraction(query.stat);

		return exportStatsOverTime(
			query.mode as VersionCategories,
			query.type,
			query.exclusive === "true",
			new Date(),
			query.version,
			typeFn,
		);
	},
	{ maxAge: 60 * 60 /* 1 hour */, swr: false },
);
