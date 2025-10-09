import tailwindcss from "@tailwindcss/vite";

const simple_types = ["projects", "versions", "authors", "files", "revenue"];
const project_types = [
	"mod",
	"plugin",
	"datapack",
	"shader",
	"resourcepack",
	"modpack",
];

var urls = [];

for (const type of simple_types) {
	urls.push(
		`https://modrinth-statistics.tobinio.dev/charts?project_type=${type}`,
	);
}

for (const type of project_types) {
	urls.push(
		`https://modrinth-statistics.tobinio.dev/charts?project_type=${type}&stat=count`,
		`https://modrinth-statistics.tobinio.dev/charts?project_type=${type}&stat=downloads`,
		`https://modrinth-statistics.tobinio.dev/charts?project_type=${type}&stat=versions`,
	);
}

export default defineNuxtConfig({
	devtools: { enabled: true },
	future: {
		compatibilityVersion: 4,
	},
	app: {
		head: {
			link: [
				{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
				{
					rel: "icon",
					type: "image/png",
					sizes: "256x256",
					href: "/favicon.png",
				},
				{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
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
		upstash: {
			redis: {
				restUrl: undefined,
				restToken: undefined,
			},
		},
		public: {
			umamiID: undefined,
		},
	},
	nitro: {
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
	vite: {
		plugins: [tailwindcss()],
	},
	css: ["~/assets/css/main.css"],
	modules: ["@nuxt/icon", "@vueuse/nuxt", "@nuxtjs/sitemap", "@nuxt/scripts"],
	compatibilityDate: "2025-07-16",
});
