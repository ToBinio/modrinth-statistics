import consola from "consola";
import type { GlobalStats } from "~~/server/utils/processing/global/types";
import { setGlobalStats } from "~~/server/utils/storage";

export async function updateGlobalStats() {
	consola.log("fetching globalStats");

	const data = await $modrinthFetch<GlobalStats>("/statistics");

	await setGlobalStats(data, new Date());
}
