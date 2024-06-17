export function getColorForLauncher(name: string): string {
    switch (name) {
        case 'fabric':
            return "#dbb69b"
        case 'quilt':
            return "#c796f9"
        case 'forge':
            return "#959eef"
        case 'neoforge':
            return "#f99e6b"
        default: {
            console.log(`unknown Launcher trying to access color - ${name}`);
            return "#ffffff"
        }
    }
}