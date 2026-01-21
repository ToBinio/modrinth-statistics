import consola from "consola";
import { z } from "zod";
import { exportGlobalStatsOverTime } from "~~/server/utils/api/export/globalStats";
import { fracture } from "~~/server/utils/processing/aggregate";
import type { StatExport } from "~~/shared/types/types";

const querySchema = z.object({
	type: ZGlobalStatCategory,
	days: z.string().optional(),
	aggregate: z.string(),
});

export default defineCachedEventHandler(
	async (event): Promise<StatExport> => {
		const query = querySchema.safeParse(getQuery(event));
		if (!query.success) {
			throw createError({
				statusCode: 400,
				statusMessage: "Invalid query parameters",
				message: query.error.message,
			});
		}

		const dateKey = await KV.LatestDate.get();

		if (dateKey instanceof Error) {
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

		switch (query.data.type) {
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

		const days = query.data.days ? parseInt(query.data.days, 10) : undefined;

		const data = await exportGlobalStatsOverTime(dateKey, typeFn, days);

		const dataPoints = Math.min(64, days ?? 64);
		if (query.data.aggregate === "false") {
			return summarize(fracture(data), dataPoints, false);
		}
		return summarize(data, dataPoints, true);
	},
	{ maxAge: 60 * 60 * 4 /* 4 hour */, swr: false },
);
