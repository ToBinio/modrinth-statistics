import type {
	GameVersions,
	VersionCategories,
} from "~~/server/utils/processing/gameVersions/types";
import type { GlobalStats } from "~~/server/utils/processing/global/types";
import type { ProjectStats } from "~~/server/utils/processing/projects/types";
import { dateToKey } from "~~/shared/utils/date";
import type { ProjectTypes } from "~~/shared/utils/project";
import { firstLetterUpperCase } from "~~/shared/utils/text";

export const KV = {
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
			const data = await getFromStorage<string>("metadata", "latestDate");

			if (!data) {
				return new Error(
					`could not find latest date in storage - storage: "metadata" key: "latestDate"`,
				);
			}

			return data;
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
			const dateKey = await KV.LatestDate.get();
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
			const dateKey = await KV.LatestDate.get();
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

async function getFromStorageCached<T>(
	storageName: string,
	key: string,
): Promise<T | Error> {
	const data = await _getFromStorageCached<T>(storageName, key);

	if (!data) {
		return new Error(
			`could not find value in storage - storage: "${storageName}" key: "${key}"`,
		);
	}

	return data;
}

const _getFromStorageCached = defineCachedFunction(
	async <t>(storageName: string, key: string) => {
		return await getFromStorage<t>(storageName, key);
	},
	{
		maxAge: 60 * 60 * 2, // 2 hours
		name: "getFromStorageCached",
		swr: false,
		getKey: (storageName: string, key: string) => `${storageName}-${key}`,
	},
) as <T>(storageName: string, key: string) => Promise<T | null>;

async function getFromStorage<t>(storageName: string, key: string) {
	const storage = useStorage(storageName);
	const data = (await storage.getItem(key)) as t;

	if (!data) {
		return null;
	}

	return data;
}

async function getFromStorageCachedBulk<T>(
	storageName: string,
	keys: string[],
): Promise<(T | Error)[]> {
	const data = await _getFromStorageCachedBulk<T>(storageName, keys);

	return data.map((item, index) => {
		if (!item) {
			return new Error(
				`could not find value in storage - storage: "${storageName}" key: "${keys[index]}"`,
			);
		}

		return item;
	});
}

const _getFromStorageCachedBulk = defineCachedFunction(
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
) as <T>(storageName: string, keys: string[]) => Promise<(T | null)[]>;

async function getFromStorageBulk<t>(storageName: string, keys: string[]) {
	const storage = useStorage(storageName);
	const data = await storage.getItems(keys);

	const mapped_data = data.map((data) => {
		if (!data.value) {
			return null;
		}

		return data.value as t;
	});

	return mapped_data;
}
