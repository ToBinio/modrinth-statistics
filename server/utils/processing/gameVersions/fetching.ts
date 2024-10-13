import type { GameVersion } from "~~/server/utils/processing/gameVersions/types";

export async function getGameVersions(): Promise<GameVersion[]> {
	const data =
		await $modrinthFetch<
			{
				version: string;
				version_type: string;
			}[]
		>("/tag/game_version");

	return data
		.map((value) => {
			return {
				name: value.version,
				fullVersion: value.version_type === "release",
			};
		})
		.toReversed();
}
