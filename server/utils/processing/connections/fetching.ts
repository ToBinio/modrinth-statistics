import type { ExtendedProjectData } from "./types";

export async function getModpackIds(
	offset: number,
	limit: number,
): Promise<string[]> {
	return getProjectIds(offset, "modpack", limit);
}

export async function getProjectData(
	projectIds: string[],
): Promise<ExtendedProjectData[]> {
	type Project = {
		id: string;
		versions: string[];
		title: string;
		description: string;
		icon_url: string;
		downloads: number;
	};

	const data = await $modrinthFetch<Project[]>("/projects", {
		query: {
			ids: `["${projectIds.join('","')}"]`,
		},
	});

	return data
		.filter((value) => value.versions.length > 0)
		.map((value) => ({
			id: value.id,
			name: value.title,
			latest_version: value.versions[value.versions.length - 1]!,
			description: value.description,
			icon_url: value.icon_url,
			downloads: value.downloads,
		}));
}

export async function getVersionDependencies(
	versionIds: string[],
): Promise<{ project_id: string; dependencies: string[] }[]> {
	type Version = {
		project_id: string;
		dependencies: { project_id: string }[];
	};

	const data = await $modrinthFetch<Version[]>("/versions", {
		query: {
			ids: `["${versionIds.join('","')}"]`,
			include_changelog: false,
		},
	});

	//done to remove unused values from the ram
	return data.map((value) => {
		const dependencyIds = Array.from(
			new Set(value.dependencies.map((d) => d.project_id).filter(Boolean)),
		);

		return {
			project_id: value.project_id,
			dependencies: dependencyIds,
		};
	});
}
