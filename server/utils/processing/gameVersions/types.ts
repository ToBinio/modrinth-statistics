export type GameVersion = {
	name: string;
	fullVersion: boolean;
};

export type GameVersionData = { name: string; contains: string[] }[];

export type GameVersions = {
	all: GameVersionData;
	major: GameVersionData;
	minor: GameVersionData;
};

export type SupportedVersions = {
	all: string[];
	major: string[];
	minor: string[];
};
