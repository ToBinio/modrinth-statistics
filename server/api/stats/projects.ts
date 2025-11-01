import { exportStats } from "~~/server/utils/api/export/projectStats";
import { statStringToExtraction } from "~~/server/utils/api/project";
import type { VersionCategories } from "~~/server/utils/processing/gameVersions/types";
import type { ProjectStatCategory } from "~~/server/utils/processing/projects/types";

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
		const typeFn = statStringToExtraction(query.stat);

		return exportStats(
			query.mode as VersionCategories,
			query.type,
			query.exclusive === "true",
			typeFn,
			query.versionTo,
			query.versionFrom,
		);
	},
	{ maxAge: 60 * 60 * 4 /* 4 hour */, swr: false },
);
