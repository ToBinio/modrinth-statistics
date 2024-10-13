import consola from "consola";

export async function updateGlobalStats() {
	consola.log("fetching globalStats");

	const data = await $modrinthFetch<{
		projects: number;
		versions: number;
		files: number;
		authors: number;
	}>("/statistics");

	const storage = useStorage("statistics");
	const dateKey = dateToKey(new Date());

	await storage.setItem(`globalStats${dateKey}`, data);
}
