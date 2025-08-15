import type { Version } from "~~/server/utils/processing/projects/types";

export async function getProjectIds(
	offset: number,
	type: string,
	limit: number,
): Promise<string[]> {
	type Project = {
		hits: { project_id: string }[];
	};

	const data = await $modrinthFetch<Project>("/search", {
		query: {
			limit: limit,
			offset: offset,
			index: import.meta.dev ? "newest" : "downloads",
			facets: `[["project_types:${type}"]]`,
		},
	});

	return data.hits.map((value) => value.project_id);
}

export async function getVersionIds(projectIds: string[]): Promise<string[]> {
	type Project = {
		versions: string[];
	};

	const data = await $modrinthFetch<Project[]>("/projects", {
		query: {
			ids: `["${projectIds.join('","')}"]`,
		},
	});

	return data.flatMap((value) => value.versions);
}

export async function getVersions(versionIds: string[]): Promise<Version[]> {
	const data = await $modrinthFetch<Version[]>("/versions", {
		query: {
			ids: `["${versionIds.join('","')}"]`,
		},
	});

	//done to remove unused values from the ram
	return data.flatMap((value) => {
		return {
			project_id: value.project_id,
			loaders: value.loaders,
			game_versions: value.game_versions,
			downloads: value.downloads,
		};
	});
}
