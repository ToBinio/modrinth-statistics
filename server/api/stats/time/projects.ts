import { exportStatsOverTime } from "~~/server/utils/api/export/projectStats";
import { statStringToExtraction } from "~~/server/utils/api/project";
import type { VersionCategories } from "~~/server/utils/processing/gameVersions/types";
import type { ProjectStatCategory } from "~~/server/utils/processing/projects/types";

type QueryData = {
	stat: ProjectStatCategory;
	mode: string;
	type: ProjectTypes;
	exclusive: string;
	version: string;
	days: number | undefined;
	aggregate: string;
};

export default defineCachedEventHandler(
	async (event): Promise<StatExport> => {
		const query = getQuery<QueryData>(event);
		const typeFn = statStringToExtraction(query.stat);

		const data = await exportStatsOverTime(
			query.mode as VersionCategories,
			query.type,
			query.exclusive === "true",
			new Date(),
			query.version,
			typeFn,
			query.days,
		);

		const dataPoints = Math.min(64, query.days ?? 64);

		if (query.aggregate === "false") {
			return summarize(fracture(data), dataPoints, false);
		}
		return summarize(data, dataPoints, true);
	},
	{ maxAge: 60 * 60 * 4 /* 4 hour */, swr: false },
);
