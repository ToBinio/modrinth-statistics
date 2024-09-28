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

	routeRules: {
		"/downloads": {
			redirect: "/downloads/major",
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

	modules: ["@nuxt/icon"],
	compatibilityDate: "2024-07-05",
});
