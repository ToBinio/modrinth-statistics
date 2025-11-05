import { z } from "zod";

export const ZProjectTypes = z.enum([
	"mod",
	"plugin",
	"datapack",
	"shader",
	"resourcepack",
	"modpack",
]);
export type ProjectTypes = z.infer<typeof ZProjectTypes>;

export const projectTypeList: ProjectTypes[] = [
	"mod",
	"plugin",
	"datapack",
	"shader",
	"resourcepack",
	"modpack",
];
