import { z } from "zod";

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

export const ZProjectStatCategory = z.enum(["versions", "count", "downloads"]);
export type ProjectStatCategory = z.infer<typeof ZProjectStatCategory>;
