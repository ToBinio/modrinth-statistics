export type Version = {
	project_id: string;
	loaders: string[];
	game_versions: string[];
	downloads: number;
};

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
