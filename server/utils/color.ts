export function getColorForLauncher(name: string): string {
    switch (name) {
        case 'fabric':
            return "#dbb69b";
        case 'quilt':
            return "#c796f9";
        case 'forge':
            return "#959eef";
        case 'neoforge':
        case 'optifine':
            return "#f99e6b";
        case 'liteloader':
        case 'canvas':
            return "#7ab0ee";
        case 'modloader':
            return "#6b7280";
        case 'rift':
            return "#bbc2d0";
        case 'bukkit':
            return "#f6af7b";
        case 'folia':
            return "#a5e388";
        case 'paper':
            return "#eeaaaa";
        case 'purpur':
        case 'iris':
            return "#c3abf7";
        case 'spigot':
            return "#f1cc84";
        case 'sponge':
            return "#f9e580";
        case 'vanilla':
        case 'minecraft':
        case 'datapack':
            return "#a5e388";
        default: {
            console.log(`unknown Launcher trying to access color - ${name}`);
            return "#6b7280";
        }
    }
}