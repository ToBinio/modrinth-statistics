import { getGameVersions } from "~~/server/utils/processing/gameVersions/fetching";
import type {
	GameVersion,
	GameVersionData,
	GameVersions,
	SupportedVersions,
} from "~~/server/utils/processing/gameVersions/types";
import type { Version } from "~~/server/utils/processing/projects/types";

export async function updateGameVersions() {
	const versions = await getGameVersions();
	const gameVersions = groupGameVersions(versions);

	await DB.GameVersions.set(gameVersions);
}

// returns what versionGroup (all, minor, major) a specif projectVersion supports
export function getSupportedGameVersions(
	gameVersions: GameVersions,
	version: Version,
): SupportedVersions {
	const data = {
		all: new Set<string>(),
		major: new Set<string>(),
		minor: new Set<string>(),
	};

	for (const gameVersion of version.game_versions) {
		data.all.add(gameVersion);

		for (const majorVersion of gameVersions.major) {
			if (majorVersion.contains.includes(gameVersion)) {
				data.major.add(majorVersion.name);
			}
		}

		for (const minorVersion of gameVersions.minor) {
			if (minorVersion.contains.includes(gameVersion)) {
				data.minor.add(minorVersion.name);
			}
		}
	}

	return {
		all: Array.from(data.all),
		major: Array.from(data.major),
		minor: Array.from(data.minor),
	};
}

function groupGameVersions(versions: GameVersion[]): GameVersions {
	const all = versions.map((value) => {
		return { name: value.name, contains: [value.name] };
	});

	const minor: GameVersionData = [];

	let currentContains: string[] = [];
	for (const version of versions) {
		currentContains.push(version.name);

		if (version.fullVersion) {
			minor.push({ name: version.name, contains: currentContains });
			currentContains = [];
		}
	}

	const major: GameVersionData = [];

	for (const version of minor) {
		const gameVersionName = version.name.split(".").slice(0, 2).join(".");

		if (
			major.length === 0 ||
			major[major.length - 1]?.name !== gameVersionName
		) {
			major.push({
				name: gameVersionName,
				contains: Array.from(version.contains),
			});
			continue;
		}

		major[major.length - 1]?.contains.push(...version.contains);
	}

	return {
		all,
		minor,
		major,
	};
}
