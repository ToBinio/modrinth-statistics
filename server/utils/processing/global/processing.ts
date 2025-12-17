import type { GlobalStats } from "~~/server/utils/processing/global/types";
import { LOGGER } from "../logging";

export async function updateGlobalStats() {
	LOGGER.info("updating globalStats [starting]");

	const data = await $modrinthFetch<GlobalStats>("/statistics");
	await KV.GlobalStats.set(data, new Date());

	LOGGER.info("updating globalStats [finished]");
}
