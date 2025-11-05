import { z } from "zod";

export type GameVersion = {
	name: string;
	fullVersion: boolean;
};

export type GameVersionData = { name: string; contains: string[] }[];

export const ZVersionCategories = z.enum(["all", "major", "minor", "unified"]);
export type VersionCategories = z.infer<typeof ZVersionCategories>;

export type GameVersions = Record<VersionCategories, GameVersionData>;
export type SupportedVersions = Record<VersionCategories, string[]>;
