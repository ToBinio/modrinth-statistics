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
			statistics: {
				driver: "mongodb",
				connectionString: `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@mongodb:27017/stats`,
				databaseName: "stats",
				collectionName: "stats",
			},
		},
		devStorage: {
			statistics: {
				driver: "fs",
				base: "./.data/statistics",
			},
			// statistics: {
			// 	driver: "mongodb",
			// 	connectionString: `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@tobinio.at:27017/stats`,
			// 	databaseName: "stats",
			// 	collectionName: "stats",
			// },
		},
		experimental: {
			tasks: true,
		},
		scheduledTasks: {
			"0 0 * * *": ["analyze"],
		},
		imports: {
			dirs: ["utils"],
		},
	},

	modules: ["@nuxt/icon", "nuxt-posthog"],
	compatibilityDate: "2024-07-05",
});
