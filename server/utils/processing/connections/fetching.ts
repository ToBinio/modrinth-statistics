export async function getModpackIds(
	offset: number,
	limit: number,
): Promise<string[]> {
	return getProjectIds(offset, "modpack", limit);
}

export async function getFirstVersionIds(
	projectIds: string[],
): Promise<string[]> {
	type Project = {
		versions: string[];
	};

	const data = await $modrinthFetch<Project[]>("/projects", {
		query: {
			ids: `["${projectIds.join('","')}"]`,
		},
	});

	return data.map((value) => value.versions[0]);
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
