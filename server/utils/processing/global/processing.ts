import consola from "consola";
import type { GlobalStats } from "~~/server/utils/processing/global/types";

export async function updateGlobalStats() {
	consola.log("fetching globalStats");

	const data = await $modrinthFetch<GlobalStats>("/statistics");

	await DB.GlobalStats.set(data, new Date());
}
