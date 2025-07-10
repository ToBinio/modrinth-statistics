const simple_types = ["projects", "versions", "authors", "files", "revenue"];
const project_types = [
	"mod",
	"plugin",
	"datapack",
	"shader",
	"resourcepack",
	"modpack",
];

var urls = [
	"https://modrinth-statistics.tobinio.dev/charts?projectType=revenue",
];

for (const type of simple_types) {
	urls.push(
		`https://modrinth-statistics.tobinio.dev/charts?projectType=${type}`,
	);
}

for (const type of project_types) {
	urls.push(
		`https://modrinth-statistics.tobinio.dev/charts?projectType=${type}&stat=count`,
		`https://modrinth-statistics.tobinio.dev/charts?projectType=${type}&stat=downloads`,
		`https://modrinth-statistics.tobinio.dev/charts?projectType=${type}&stat=versions`,
	);
}

export default defineNuxtConfig({
	devtools: { enabled: true },
	future: {
		compatibilityVersion: 4,
	},
	runtimeConfig: {
		public: {
			umamiId: process.env.UMAMI_ID,
		},
	},
	umami: {
		id: process.env.UMAMI_ID,
		host: "https://cloud.umami.is",
		autoTrack: true,
		ignoreLocalhost: true,
		proxy: "cloak",
	},
	app: {
		head: {
			link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
		},
	},
	site: {
		url: "https://modrinth-statistics.tobinio.dev",
	},
	sitemap: {
		urls: urls,
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
			cache: {
				driver: "null",
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
		"@nuxtjs/sitemap",
		"@nuxt/scripts",
		"nuxt-umami",
	],
	compatibilityDate: "2024-07-05",
});
