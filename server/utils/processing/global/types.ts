import { z } from "zod";

export type GlobalStats = {
	projects: number;
	versions: number;
	files: number;
	authors: number;
};

export const ZGlobalStatCategory = z.enum([
	"projects",
	"versions",
	"files",
	"authors",
]);
export type GlobalStatCategory = z.infer<typeof ZGlobalStatCategory>;
