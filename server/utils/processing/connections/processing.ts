import { DB } from "../../db/sql";
import { LOGGER } from "../logging";
import {
	getModpackIds,
	getProjectData,
	getVersionDependencies,
} from "./fetching";
import type { ExtendedProjectData } from "./types";

export async function updateConnections() {
	LOGGER.info("updating connections [starting]");

	const BATCH_SIZE = import.meta.dev ? 1 : 1_000;

	let projectIndex = 0;
	while (true) {
		let done = false;

		const batchProjectIds = [];
		while (batchProjectIds.length < BATCH_SIZE) {
			const projectIds = await getModpackIds(projectIndex, 100);
			batchProjectIds.push(...projectIds);
			projectIndex += 100;

			if (projectIds.length !== 100) {
				done = true;
				break;
			}
		}

		const modpacks: ExtendedProjectData[] = [];
		for (const chunk of chunkArray(batchProjectIds, 100)) {
			const versions = await getProjectData(chunk);
			modpacks.push(...versions);
		}

		for (const chunk of chunkArray(modpacks, 100)) {
			const result = await DB.addModpacksBulk(
				chunk.map((modpack) => {
					return {
						id: modpack.id,
						name: modpack.name,
						description: modpack.description,
						iconUrl: modpack.icon_url,
						downloads: modpack.downloads,
					};
				}),
			);
			if (result instanceof Error) {
				LOGGER.warn(result);
			}
		}

		const modpackVersions = modpacks.map((modpack) => modpack.latest_version);

		const versionDependencies: {
			project_id: string;
			dependencies: string[];
		}[] = [];
		for (const chunk of chunkArray(modpackVersions, 100)) {
			const dependencies = await getVersionDependencies(chunk);
			versionDependencies.push(...dependencies);
		}

		for (const pair of versionDependencies) {
			const connections = pair.dependencies.map((dependency) => {
				return {
					projectId: pair.project_id,
					dependencyId: dependency,
				};
			});

			if (connections.length === 0) {
				continue;
			}

			const result = await DB.addConnectionsBulk(connections);

			if (result instanceof Error) {
				LOGGER.warn(result, connections);
			}
		}

		if (done || import.meta.dev) break;
	}

	LOGGER.info("updating connections [finished]");
}
