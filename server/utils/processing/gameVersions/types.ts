export type GameVersion = {
	name: string;
	fullVersion: boolean;
};

export type GameVersionData = { name: string; contains: string[] }[];

export type VersionCategories = "all" | "major" | "minor" | "unified";

export type GameVersions = Record<VersionCategories, GameVersionData>;
export type SupportedVersions = Record<VersionCategories, string[]>;
