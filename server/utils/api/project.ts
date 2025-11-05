import type {
	ProjectStatCategory,
	ProjectStatsValue,
} from "~~/server/utils/processing/projects/types";

export function statStringToExtraction(stat: ProjectStatCategory | null) {
	let typeFn: (value: ProjectStatsValue) => number;

	switch (stat) {
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

	return typeFn;
}
