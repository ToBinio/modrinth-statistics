const allowedModLoaders = ["fabric", "forge", "neoforge", "quilt", "liteloader", "modloader", "rift"]

export function isAllowedModLoader(name: string) {
    return allowedModLoaders.includes(name);
}