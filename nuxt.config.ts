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
	umami: {
		autoTrack: true,
		ignoreLocalhost: true,
		proxy: "cloak",
	},
	app: {
		head: {
			link: [
				{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
				{
					rel: "apple-touch-icon",
					sizes: "180x180",
					href: "/apple-touch-icon.png",
				},
			],
		},
	},
	site: {
		url: "https://modrinth-statistics.tobinio.dev",
	},
	sitemap: {
		urls: urls,
	},
	runtimeConfig: {
		mongodb: {
			databaseName: "",
			connectionString: "",
		},
	},
	nitro: {
		preset: "bun",
		devStorage: {
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
		"nuxt-umami",
	],
	compatibilityDate: "2025-07-16",
});
