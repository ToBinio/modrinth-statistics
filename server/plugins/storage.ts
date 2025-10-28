import fsDriver from "unstorage/drivers/fs";
import upstashDriver from "unstorage/drivers/upstash";

export default defineNitroPlugin(() => {
	if (import.meta.dev) {
		defnineProductionStorage();
	} else {
		defnineProductionStorage();
	}
});

function defnineProductionStorage() {
	const storage = useStorage();

	storage.mount(
		"globalStatistics",
		upstashDriver({
			url: useRuntimeConfig().upstash.redis.restUrl,
			token: useRuntimeConfig().upstash.redis.restToken,
			base: "globalStatistics",
		}),
	);
	storage.mount(
		"projectStatistics",
		upstashDriver({
			url: useRuntimeConfig().upstash.redis.restUrl,
			token: useRuntimeConfig().upstash.redis.restToken,
			base: "projectStatistics",
		}),
	);
	storage.mount(
		"metadata",
		upstashDriver({
			url: useRuntimeConfig().upstash.redis.restUrl,
			token: useRuntimeConfig().upstash.redis.restToken,
			base: "metadata",
		}),
	);
}

function defineDevelopmentStorage() {
	const storage = useStorage();

	storage.mount(
		"globalStatistics",
		fsDriver({
			base: "storage/globalStatistics",
		}),
	);
	storage.mount(
		"projectStatistics",
		fsDriver({
			base: "storage/projectStatistics",
		}),
	);
	storage.mount(
		"metadata",
		fsDriver({
			base: "storage/metadata",
		}),
	);
}
