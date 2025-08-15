import upstashDriver from "unstorage/drivers/upstash";

export default defineNitroPlugin(() => {
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
});
