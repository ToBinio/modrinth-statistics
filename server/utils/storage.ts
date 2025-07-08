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
			return getFromStorage("metadata", "gameVersions");
		},
	},
	LatestDate: {
		async set(date: Date) {
			const storage = useStorage("metadata");
			await storage.setItem("latestDate", dateToKey(date));
		},
		async get(): Promise<string | Error> {
			return getFromStorage("metadata", "latestDate");
		},
	},
	GlobalStats: {
		async set(data: GlobalStats, date: Date) {
			const storage = useStorage("metadata");
			const dateKey = dateToKey(date);

			await storage.setItem(`globalStats${dateKey}`, data);
		},
		async getBulk(dates: Date[]): Promise<(GlobalStats | Error)[]> {
			const keys = dates.map((date) => {
				const dateKey = dateToKey(date);
				return `globalStats${dateKey}`;
			});

			return getFromStorageBulk("globalStatistics", keys);
		},
		async getLatest(): Promise<GlobalStats | Error> {
			const dateKey = await DB.LatestDate.get();
			if (dateKey instanceof Error) return dateKey;

			const key = `globalStats${dateKey}`;
			return getFromStorage("globalStatistics", key);
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

			return getFromStorage("projectStatistics", key);
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

			return getFromStorageBulk("projectStatistics", keys);
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
			return getFromStorage("projectStatistics", key);
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
