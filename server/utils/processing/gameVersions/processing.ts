import { getGameVersions } from "~~/server/utils/processing/gameVersions/fetching";
import type {
	GameVersion,
	GameVersionData,
	GameVersions,
	SupportedVersions,
} from "~~/server/utils/processing/gameVersions/types";
import type { Version } from "~~/server/utils/processing/projects/types";
import { LOGGER } from "../logging";

export async function updateGameVersions() {
	LOGGER.info("updating game versions [starting]");

	const versions = await getGameVersions();
	const gameVersions = groupGameVersions(versions);

	await KV.GameVersions.set(gameVersions);

	LOGGER.info("updating game versions [finished]");
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
		unified: new Set<string>(),
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

		for (const unifiedVersion of gameVersions.unified) {
			if (unifiedVersion.contains.includes(gameVersion)) {
				data.unified.add(unifiedVersion.name);
			}
		}
	}

	return {
		all: Array.from(data.all),
		major: Array.from(data.major),
		minor: Array.from(data.minor),
		unified: Array.from(data.unified),
	};
}

function getMinorVersionName(version: string): string {
	const split = (version.split("-")[0] ?? "").split(".");
	if (Number.isNaN(Number.parseInt(split[0]!, 10))) {
		return version;
	}

	if (split[0] === "1") {
		return split.slice(0, 3).join(".");
	} else {
		return split.slice(0, 2).join(".");
	}
}

function getMajorVersionName(version: string): string {
	const split = (version.split("-")[0] ?? "").split(".");
	if (Number.isNaN(Number.parseInt(split[0]!, 10))) {
		return version;
	}

	if (split[0] === "1") {
		return split.slice(0, 2).join(".");
	} else {
		return split[0] ?? "";
	}
}

function groupData(
	versions: GameVersion[],
	fn: (version: string) => string,
): GameVersionData {
	const data: GameVersionData = [];

	let currentContains: string[] = [];
	for (const version of versions) {
		const gameVersionName = fn(version.name);
		currentContains.push(version.name);

		if (version.fullVersion) {
			data.push({ name: gameVersionName, contains: currentContains });
			currentContains = [];
		}

		if (data[data.length - 2]?.name === gameVersionName) {
			data[data.length - 2]?.contains.push(
				...(data[data.length - 1]?.contains ?? []),
			);
			data.pop();
		}
	}

	return data;
}

export function groupGameVersions(versions: GameVersion[]): GameVersions {
	const all = versions.map((value) => {
		return { name: value.name, contains: [value.name] };
	});

	const minor = groupData(versions, getMinorVersionName);
	const major = groupData(versions, getMajorVersionName);

	const unified: GameVersionData = [{ name: "unified", contains: [] }];
	for (const version of versions) {
		unified[0]!.contains.push(version.name);
	}

	return {
		all,
		minor,
		major,
		unified,
	};
}
