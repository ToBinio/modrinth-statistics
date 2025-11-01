import consola from "consola";
import fsDriver from "unstorage/drivers/fs";
import upstashDriver from "unstorage/drivers/upstash";

export default defineNitroPlugin(() => {
	if (import.meta.dev && !useRuntimeConfig().useProdInDev) {
		defineDevelopmentStorage();
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

	consola.info("Storage initialized");
}

function defineDevelopmentStorage() {
	const storage = useStorage();

	storage.mount(
		"globalStatistics",
		fsDriver({
			base: ".data/globalStatistics",
		}),
	);
	storage.mount(
		"projectStatistics",
		fsDriver({
			base: ".data/projectStatistics",
		}),
	);
	storage.mount(
		"metadata",
		fsDriver({
			base: ".data/metadata",
		}),
	);
}
