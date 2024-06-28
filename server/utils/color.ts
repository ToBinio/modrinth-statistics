export function getColorForLauncher(name: string): string {
    switch (name) {
        case 'fabric':
            return "#dbb69b";
        case 'quilt':
            return "#c796f9";
        case 'forge':
            return "#959eef";
        case 'neoforge':
            return "#f99e6b";
        case 'liteloader':
            return "#7ab0ee";
        case 'bukkit':
            return "#f6af7b";
        case 'bungeecord':
            return "#d2c080";
        case 'folia':
            return "#a5e388";
        case 'paper':
            return "#eeaaaa";
        case 'purpur':
            return "#c3abf7";
        case 'spigot':
            return "#f1cc84";
        case 'velocity':
            return "#83d5ef";
        case 'waterfall':
            return "#78a4fb";
        case 'sponge':
            return "#f9e580";
        default: {
            console.log(`unknown Launcher trying to access color - ${name}`);
            return "#6b7280";
        }
    }
}