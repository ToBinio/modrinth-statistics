export type ProjectStats = {
	versions: string[];
	data: {
		name: string;
		values: ProjectStatsValue[];
	}[];
};

export type ProjectStatsValue = {
	downloads: number;
	versions: number;
	count: number;
};

export type ProjectStatCategory = "versions" | "count" | "downloads";
