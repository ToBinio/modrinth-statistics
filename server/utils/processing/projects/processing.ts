import { chunkArray } from "#shared/utils/array";
import { LOGGER } from "~~/server/tasks/analyze";
import { getSupportedGameVersions } from "~~/server/utils/processing/gameVersions/processing";
import type {
	GameVersionData,
	GameVersions,
} from "~~/server/utils/processing/gameVersions/types";
import {
	getProjectIds,
	getVersionIds,
	getVersions,
} from "~~/server/utils/processing/projects/fetching";
import type {
	ProjectStats,
	Version,
} from "~~/server/utils/processing/projects/types";

type StatsDataType = Map<
	string,
	Map<
		string,
		{
			downloads: number;
			versions: number;
			unique_projects: Set<string>;
		}
	>
>;

type StatsDataEntry = {
	all: StatsDataType;
	minor: StatsDataType;
	major: StatsDataType;
};

type StatsData = { all: StatsDataEntry; exclusive: StatsDataEntry };

type AllStatsEntry = {
	all: ProjectStats;
	minor: ProjectStats;
	major: ProjectStats;
};

type AllStats = { all: AllStatsEntry; exclusive: AllStatsEntry };

type GroupStats = {
	versions: string[];
	data: {
		name: string;
		values: {
			downloads: number;
			versions: number;
			unique_projects: Set<string>;
		}[];
	}[];
};

export async function updateStatistics() {
	for (const type of projectTypeList) {
		await updateStatistic(type);
	}
}

async function updateStatistic(type: ProjectTypes) {
	LOGGER.info(`analyzing - ${type}`);
	const stats = await getStatistics(type);

	if (stats instanceof Error) {
		LOGGER.error(stats.message);
		return;
	}

	await saveStats(stats, type);
}

async function saveStats(stats: AllStats, type: ProjectTypes) {
	await DB.ProjectStats.set(stats.all.all, type, "all", false);
	await DB.ProjectStats.set(stats.all.minor, type, "minor", false);
	await DB.ProjectStats.set(stats.all.major, type, "major", false);

	await DB.ProjectStats.set(stats.exclusive.all, type, "all", true);
	await DB.ProjectStats.set(stats.exclusive.minor, type, "minor", true);
	await DB.ProjectStats.set(stats.exclusive.major, type, "major", true);
}

async function getStatistics(type: ProjectTypes): Promise<AllStats | Error> {
	const BATCH_COUNT = import.meta.dev ? 1 : 10;
	const data: StatsData = {
		all: { all: new Map(), major: new Map(), minor: new Map() },
		exclusive: { all: new Map(), major: new Map(), minor: new Map() },
	};

	const gameVersions = await DB.GameVersions.get();

	if (gameVersions instanceof Error) {
		return gameVersions;
	}

	let projectIndex = 0;
	while (true) {
		let done = false;

		const batchProjectIds = [];
		for (let i = 0; i < BATCH_COUNT; i++) {
			const projectIds = await getProjectIds(projectIndex, type, 100);
			batchProjectIds.push(...projectIds);
			projectIndex += 100;

			if (projectIds.length !== 100) {
				done = true;
				break;
			}
		}

		const versionIds: string[] = [];
		for (const chunk of chunkArray(batchProjectIds, 200)) {
			const versions = await getVersionIds(chunk);
			versionIds.push(...versions);
		}

		await analyzeVersionsFromIds(gameVersions, versionIds, data, type);

		if (done || import.meta.dev) break;
	}

	function toVersions(
		gameVersions: GameVersions,
		data: StatsDataEntry,
	): AllStatsEntry {
		return {
			all: groupStatsToStats(StatsFromType(gameVersions.all, data.all)),
			minor: groupStatsToStats(StatsFromType(gameVersions.minor, data.minor)),
			major: groupStatsToStats(StatsFromType(gameVersions.major, data.major)),
		};
	}

	return {
		all: toVersions(gameVersions, data.all),
		exclusive: toVersions(gameVersions, data.exclusive),
	};
}

function groupStatsToStats(groupStats: GroupStats): ProjectStats {
	return {
		versions: groupStats.versions,
		data: groupStats.data.map((value) => {
			return {
				name: value.name,
				values: value.values.map((value1) => {
					return {
						downloads: value1.downloads,
						versions: value1.versions,
						count: value1.unique_projects.size,
					};
				}),
			};
		}),
	};
}

async function analyzeVersionsFromIds(
	gameVersions: GameVersions,
	versionIds: string[],
	data: StatsData,
	type: ProjectTypes,
) {
	const BATCH_SIZE = 200;

	let currentIndex = 0;

	while (true) {
		const ids = versionIds.slice(currentIndex, currentIndex + BATCH_SIZE);
		currentIndex += BATCH_SIZE;

		const versions = await getVersions(ids);

		analyzeVersions(gameVersions, versions, data, type);
		if (ids.length !== BATCH_SIZE) break;
	}
}

function analyzeVersions(
	gameVersions: GameVersions,
	versions: Version[],
	data: StatsData,
	type: ProjectTypes,
) {
	for (const version of versions) {
		const supportedLaunchers = version.loaders.filter((value) =>
			isAllowedModLoader(value, type),
		);
		const supportedVersions = getSupportedGameVersions(gameVersions, version);

		insertLauncherData(
			data.all.all,
			supportedLaunchers,
			supportedVersions.all,
			version.project_id,
			version.downloads,
		);
		insertLauncherData(
			data.all.minor,
			supportedLaunchers,
			supportedVersions.minor,
			version.project_id,
			version.downloads,
		);
		insertLauncherData(
			data.all.major,
			supportedLaunchers,
			supportedVersions.major,
			version.project_id,
			version.downloads,
		);

		if (supportedLaunchers.length === 1) {
			insertLauncherData(
				data.exclusive.all,
				supportedLaunchers,
				supportedVersions.all,
				version.project_id,
				version.downloads,
			);
			insertLauncherData(
				data.exclusive.minor,
				supportedLaunchers,
				supportedVersions.minor,
				version.project_id,
				version.downloads,
			);
			insertLauncherData(
				data.exclusive.major,
				supportedLaunchers,
				supportedVersions.major,
				version.project_id,
				version.downloads,
			);
		}
	}
}

function insertLauncherData(
	data: StatsDataType,
	supportedLaunchers: string[],
	supportedVersions: string[],
	project_id: string,
	downloads: number,
) {
	// compensate for a version contributing to multiple loaders and versions
	const downloadsPerVersion =
		downloads / (supportedLaunchers.length * supportedVersions.length);

	for (const loader of supportedLaunchers) {
		let loaderData = data.get(loader);

		if (!loaderData) {
			const map = new Map();

			data.set(loader, map);
			loaderData = map;
		}

		for (const gameVersion of supportedVersions) {
			const data = loaderData.get(gameVersion);

			if (data) {
				data.unique_projects.add(project_id);
				loaderData.set(gameVersion, {
					downloads: data.downloads + downloadsPerVersion,
					versions: data.versions + 1,
					unique_projects: data.unique_projects,
				});
			} else {
				const set = new Set<string>();

				loaderData.set(gameVersion, {
					downloads: downloadsPerVersion,
					versions: 1,
					unique_projects: set,
				});
			}
		}
	}
}

function StatsFromType(
	gameVersions: GameVersionData,
	data: StatsDataType,
): GroupStats {
	const versions = gameVersions.map((value) => value.name);

	const loaderData = [];

	for (const loader of data) {
		const downloadsMap = loader[1];
		let downloads = [];

		for (const version of versions) {
			const data = downloadsMap.get(version);

			if (data) {
				downloads.push(data);
			} else {
				downloads.push({
					downloads: 0,
					versions: 0,
					unique_projects: new Set<string>(),
				});
			}
		}

		downloads = downloads.map((value) => {
			return {
				downloads: Math.round(value.downloads),
				versions: value.versions,
				unique_projects: value.unique_projects,
			};
		});

		loaderData.push({
			name: loader[0],
			values: downloads,
		});
	}

	loaderData.sort((a, b) => a.name.localeCompare(b.name));

	return { versions: versions, data: loaderData };
}
