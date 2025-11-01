import { LOGGER } from "~~/server/tasks/analyze";
import { DB } from "../../db/sql";
import {
	getFirstVersionIds,
	getModpackIds,
	getVersionDependencies,
} from "./fetching";

export async function updateConnections() {
	LOGGER.info("updating connections [starting]");

	const BATCH_SIZE = import.meta.dev ? 1 : 10_000;

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

		const versionIds: string[] = [];
		for (const chunk of chunkArray(batchProjectIds, 200)) {
			const versions = await getFirstVersionIds(chunk);
			versionIds.push(...versions);
		}

		const versionDependencies = await getVersionDependencies(versionIds);
		for (const pair of versionDependencies) {
			const connections = pair.dependencies.map((dependency) => {
				return {
					project_id: pair.project_id,
					dependency_id: dependency,
				};
			});

			const result = await DB.addBulk(connections);

			if (result instanceof Error) {
				LOGGER.warn(result, connections);
			}
		}

		if (done || import.meta.dev) break;
	}

	LOGGER.info("updating connections [finished]");
}
