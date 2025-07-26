import { createStorage } from "unstorage";
import mongodbDriver from "unstorage/drivers/mongodb";

// globalStatistics
const fromGlobalStatistics = createStorage({
	driver: mongodbDriver({
		connectionString: process.env.connectionString!,
		databaseName: process.env.databaseNameFrom!,
		collectionName: "globalStatistics",
	}),
});

const toGlobalStatistics = createStorage({
	driver: mongodbDriver({
		connectionString: process.env.connectionString!,
		databaseName: process.env.databaseNameTo!,
		collectionName: "globalStatistics",
	}),
});

// projectStatistics
const fromProjectStatistics = createStorage({
	driver: mongodbDriver({
		connectionString: process.env.connectionString!,
		databaseName: process.env.databaseNameFrom!,
		collectionName: "projectStatistics",
	}),
});

const toProjectStatistics = createStorage({
	driver: mongodbDriver({
		connectionString: process.env.connectionString!,
		databaseName: process.env.databaseNameTo!,
		collectionName: "projectStatistics",
	}),
});

// metadata
const fromMetadata = createStorage({
	driver: mongodbDriver({
		connectionString: process.env.connectionString!,
		databaseName: process.env.databaseNameFrom!,
		collectionName: "metadata",
	}),
});

const toMetadata = createStorage({
	driver: mongodbDriver({
		connectionString: process.env.connectionString!,
		databaseName: process.env.databaseNameTo!,
		collectionName: "metadata",
	}),
});

function chunkArray<T>(array: T[], size: number): T[][] {
	return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
		array.slice(i * size, i * size + size),
	);
}

chunkArray(await fromGlobalStatistics.getKeys(), 100).forEach(
	async (keys, index) => {
		const values = await fromGlobalStatistics.getItems(keys);
		await toGlobalStatistics.setItems(values);

		console.log(`Migrated ${100 * index} keys from globalStatistics`);
	},
);

chunkArray(await fromProjectStatistics.getKeys(), 100).forEach(
	async (keys, index) => {
		const values = await fromProjectStatistics.getItems(keys);
		await toProjectStatistics.setItems(values);

		console.log(`Migrated ${100 * index} keys from projectStatistics`);
	},
);

chunkArray(await fromMetadata.getKeys(), 100).forEach(async (keys, index) => {
	const values = await fromMetadata.getItems(keys);
	await toMetadata.setItems(values);

	console.log(`Migrated ${100 * index} keys from metadata`);
});
