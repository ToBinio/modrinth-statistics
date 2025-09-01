import type {
	GameVersions,
	VersionCategories,
} from "~~/server/utils/processing/gameVersions/types";
import type { GlobalStats } from "~~/server/utils/processing/global/types";
import type { ProjectStats } from "~~/server/utils/processing/projects/types";

export const DB = {
	GameVersions: {
		async set(gameVersions: GameVersions) {
			const storage = useStorage("metadata");
			await storage.setItem("gameVersions", gameVersions);
		},
		async get(): Promise<GameVersions | Error> {
			return getFromStorageCached("metadata", "gameVersions");
		},
	},
	LatestDate: {
		async set(date: Date) {
			const storage = useStorage("metadata");
			await storage.setItem("latestDate", dateToKey(date));
		},
		async get(): Promise<string | Error> {
			return getFromStorageCached("metadata", "latestDate");
		},
		async getNotCached(): Promise<string | Error> {
			return getFromStorage("metadata", "latestDate");
		},
	},
	GlobalStats: {
		async set(data: GlobalStats, date: Date) {
			const storage = useStorage("globalStatistics");
			const dateKey = dateToKey(date);

			await storage.setItem(`globalStats${dateKey}`, data);
		},
		async getBulk(dates: Date[]): Promise<(GlobalStats | Error)[]> {
			const keys = dates.map((date) => {
				const dateKey = dateToKey(date);
				return `globalStats${dateKey}`;
			});

			return getFromStorageCachedBulk("globalStatistics", keys);
		},
		async getLatest(): Promise<GlobalStats | Error> {
			const dateKey = await DB.LatestDate.get();
			if (dateKey instanceof Error) return dateKey;

			const key = `globalStats${dateKey}`;
			return getFromStorageCached("globalStatistics", key);
		},
	},
	ProjectStats: {
		async set(
			data: ProjectStats,
			type: ProjectTypes,
			versionCategory: VersionCategories,
			exclusive: boolean,
		) {
			const storage = useStorage("projectStatistics");

			const dateKey = dateToKey(new Date());
			const key = getProjectStorageKey(
				type,
				versionCategory,
				exclusive,
				dateKey,
			);

			await storage.setItem<ProjectStats>(key, data);
		},
		async get(
			date: Date,
			type: ProjectTypes,
			versionCategory: VersionCategories,
			exclusive: boolean,
		): Promise<ProjectStats | Error> {
			const dateKey = dateToKey(date);
			const key = getProjectStorageKey(
				type,
				versionCategory,
				exclusive,
				dateKey,
			);

			return await getFromStorageCached<ProjectStats>("projectStatistics", key);
		},
		async getBulk(
			dates: Date[],
			type: ProjectTypes,
			versionCategory: VersionCategories,
			exclusive: boolean,
		): Promise<(ProjectStats | Error)[]> {
			const keys = dates.map((date) => {
				const dateKey = dateToKey(date);
				return getProjectStorageKey(type, versionCategory, exclusive, dateKey);
			});

			return getFromStorageCachedBulk("projectStatistics", keys);
		},
		async getLatest(
			type: ProjectTypes,
			versionCategory: VersionCategories,
			exclusive: boolean,
		): Promise<ProjectStats | Error> {
			const dateKey = await DB.LatestDate.get();
			if (dateKey instanceof Error) return dateKey;

			const key = getProjectStorageKey(
				type,
				versionCategory,
				exclusive,
				dateKey,
			);
			return getFromStorageCached("projectStatistics", key);
		},
	},
};

function getProjectStorageKey(
	type: ProjectTypes,
	versionCategory: VersionCategories,
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

const getFromStorageCached = defineCachedFunction(
	async <t>(storageName: string, key: string) => {
		return await getFromStorage<t>(storageName, key);
	},
	{
		maxAge: 60 * 60 * 2, // 2 hours
		name: "getFromStorageCached",
		swr: false,
		getKey: (storageName: string, key: string) => `${storageName}-${key}`,
	},
) as <T>(storageName: string, key: string) => Promise<T>;

async function getFromStorage<t>(storageName: string, key: string) {
	const storage = useStorage(storageName);
	const data = (await storage.getItem(key)) as t;

	if (!data) {
		return new Error(
			`could not find value in storage - storage: "${storageName}" key: "${key}"`,
		);
	}

	return data;
}

const getFromStorageCachedBulk = defineCachedFunction(
	async <t>(storageName: string, keys: string[]) => {
		return await getFromStorageBulk<t>(storageName, keys);
	},
	{
		maxAge: 60 * 60 * 2, // 2 hours
		name: "getFromStorageCachedBulk",
		swr: false,
		getKey: (storageName: string, keys: string[]) =>
			`${storageName}-${keys[0]}-${keys[keys.length - 1]}`,
	},
) as <T>(storageName: string, keys: string[]) => Promise<T[]>;

async function getFromStorageBulk<t>(storageName: string, keys: string[]) {
	const storage = useStorage(storageName);
	const data = await storage.getItems(keys);

	const mapped_data = data.map((data) => {
		if (!data.value) {
			return new Error(
				`could not find value in storage - storage: "${storageName}" key: "${data.key}"`,
			);
		}

		return data.value as t;
	});

	return mapped_data;
}
