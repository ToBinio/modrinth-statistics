import mongodbDriver from "unstorage/drivers/mongodb";

export default defineNitroPlugin(() => {
	const storage = useStorage();

	storage.mount(
		"globalStatistics",
		mongodbDriver({
			connectionString: useRuntimeConfig().mongodb.connectionString,
			databaseName: useRuntimeConfig().mongodb.databaseName,
			collectionName: "globalStatistics",
		}),
	);
	storage.mount(
		"projectStatistics",
		mongodbDriver({
			connectionString: useRuntimeConfig().mongodb.connectionString,
			databaseName: useRuntimeConfig().mongodb.databaseName,
			collectionName: "projectStatistics",
		}),
	);
	storage.mount(
		"metadata",
		mongodbDriver({
			connectionString: useRuntimeConfig().mongodb.connectionString,
			databaseName: useRuntimeConfig().mongodb.databaseName,
			collectionName: "metadata",
		}),
	);
});
