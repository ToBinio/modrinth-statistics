import type { GameVersions } from "~~/server/utils/processing/gameVersions/types";
import type { GlobalStats } from "~~/server/utils/processing/global/types";
import type { ProjectStats } from "~~/server/utils/processing/projects/types";

export async function setGameVersions(gameVersions: GameVersions) {
	const storage = useStorage("metadata");
	await storage.setItem("gameVersions", gameVersions);
}

export async function getGameVersions(): Promise<GameVersions | Error> {
	return getFromStorage("metadata", "gameVersions");
}

export async function setLatestDate(date: Date) {
	const storage = useStorage("metadata");
	await storage.setItem("latestDate", dateToKey(date));
}

export async function getLatestDate(): Promise<string | Error> {
	return getFromStorage("metadata", "latestDate");
}

export async function setGlobalStats(data: GlobalStats, date: Date) {
	const storage = useStorage("globalStatistics");
	const dateKey = dateToKey(date);

	await storage.setItem(`globalStats${dateKey}`, data);
}

export async function getLatestGlobalStats(): Promise<GlobalStats | Error> {
	const dateKey = await getLatestDate();
	const key = `globalStats${dateKey}`;

	return getFromStorage("globalStatistics", key);
}

export async function getGlobalStats(date: Date): Promise<GlobalStats | Error> {
	const dateKey = dateToKey(date);
	const key = `globalStats${dateKey}`;

	return getFromStorage("globalStatistics", key);
}

function getProjectStorageKey(
	type: ProjectTypes,
	versionCategory: "all" | "major" | "minor",
	exclusive: boolean,
	dateKey: string,
) {
	// key format: <projectType>Stats<versionCategory><?exclusive><date>
	let key = `${type}Stats${firstLetterUpperCase(versionCategory)}`;

	if (exclusive) {
		key += "Exclusive";
	}

	key += dateKey;
	return key;
}

export async function setProjectStats(
	data: ProjectStats,
	type: ProjectTypes,
	versionCategory: "all" | "major" | "minor",
	exclusive: boolean,
) {
	const storage = useStorage("projectStatistics");

	const dateKey = dateToKey(new Date());
	const key = getProjectStorageKey(type, versionCategory, exclusive, dateKey);

	await storage.setItem<ProjectStats>(key, data);
}

export async function getProjectStats(
	date: Date,
	type: ProjectTypes,
	versionCategory: "all" | "major" | "minor",
	exclusive: boolean,
): Promise<ProjectStats | Error> {
	const dateKey = dateToKey(date);
	const key = getProjectStorageKey(type, versionCategory, exclusive, dateKey);

	return getFromStorage("projectStatistics", key);
}

export async function getLatestProjectStats(
	type: ProjectTypes,
	versionCategory: "all" | "major" | "minor",
	exclusive: boolean,
): Promise<ProjectStats | Error> {
	const dateKey = await getLatestDate();

	if (dateKey instanceof Error) return dateKey;

	const key = getProjectStorageKey(type, versionCategory, exclusive, dateKey);

	return getFromStorage("projectStatistics", key);
}

type StorageValue = null | string | number | boolean | object;
async function getFromStorage<t extends StorageValue>(
	storageName: string,
	key: string,
) {
	const storage = useStorage(storageName);
	const data = await storage.getItem<t>(key);

	if (!data) {
		return new Error(
			`could not find value in storage - storage: "${storageName}" key: "${key}"`,
		);
	}

	return data;
}
