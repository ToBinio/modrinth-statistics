// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	future: {
		compatibilityVersion: 4,
	},

	app: {
		head: {
			link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
		},
	},

	nitro: {
		// preset: "bun",
		storage: {
			globalStatistics: {
				driver: "mongodb",
				connectionString: `${process.env.MONGODB_CONNECTION}`,
				databaseName: `${process.env.MONGODB_DB}`,
				collectionName: "globalStatistics",
			},
			projectStatistics: {
				driver: "mongodb",
				connectionString: `${process.env.MONGODB_CONNECTION}`,
				databaseName: `${process.env.MONGODB_DB}`,
				collectionName: "projectStatistics",
			},
			metadata: {
				driver: "mongodb",
				connectionString: `${process.env.MONGODB_CONNECTION}`,
				databaseName: `${process.env.MONGODB_DB}`,
				collectionName: "metadata",
			},
		},
		devStorage: {
			globalStatistics: {
				driver: "mongodb",
				connectionString: `${process.env.MONGODB_DEV_CONNECTION}`,
				databaseName: `${process.env.MONGODB_DEV_DB}`,
				collectionName: "globalStatistics",
			},
			projectStatistics: {
				driver: "mongodb",
				connectionString: `${process.env.MONGODB_DEV_CONNECTION}`,
				databaseName: `${process.env.MONGODB_DEV_DB}`,
				collectionName: "projectStatistics",
			},
			metadata: {
				driver: "mongodb",
				connectionString: `${process.env.MONGODB_DEV_CONNECTION}`,
				databaseName: `${process.env.MONGODB_DEV_DB}`,
				collectionName: "metadata",
			},
		},
		experimental: {
			tasks: true,
		},
		scheduledTasks: {
			"0 * * * *": ["analyze"],
		},
	},

	modules: [
		"@nuxt/icon",
		"@nuxtjs/tailwindcss",
		"@vueuse/nuxt",
	],
	compatibilityDate: "2024-07-05",
});
