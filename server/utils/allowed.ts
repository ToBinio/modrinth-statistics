const allowedModLoaders = [
	"fabric",
	"forge",
	"neoforge",
	"quilt",
	"liteloader",
	"modloader",
	"rift",
];
const allowedPluginLoaders = [
	"bukkit",
	"folia",
	"paper",
	"purpur",
	"spigot",
	"sponge",
];
const allowedShaderLoaders = ["canvas", "iris", "optifine", "vanilla"];
const allowedResourcePackLoaders = ["minecraft"];
const allowedDatapackLoaders = ["datapack"];

export function isAllowedModLoader(name: string, type: ProjectTypes) {
	switch (type) {
		case "mod":
			return allowedModLoaders.includes(name);
		case "plugin":
			return allowedPluginLoaders.includes(name);
		case "datapack":
			return allowedDatapackLoaders.includes(name);
		case "shader":
			return allowedShaderLoaders.includes(name);
		case "resourcepack":
			return allowedResourcePackLoaders.includes(name);
		case "modpack":
			return allowedModLoaders.includes(name);
	}
}
