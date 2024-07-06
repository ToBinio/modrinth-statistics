import {GameVersion, Version} from "~/server/utils/fetchData";

export type GameVersionData = { name: string, contains: string[] }[]
export type GameVersions = {
    all: GameVersionData
    major: GameVersionData
    minor: GameVersionData
}

export function splitGameVersions(versions: GameVersion[]): GameVersions {
    let all = versions.map(value => {
        return {name: value.name, contains: [value.name]}
    })

    let minor: GameVersionData = []

    let currentContains: string[] = []
    for (let version of versions) {
        currentContains.push(version.name)

        if (version.fullVersion) {
            minor.push({name: version.name, contains: currentContains})
            currentContains = []
        }
    }

    let major: GameVersionData = []

    for (let version of minor) {
        let gameVersionName = version.name.split(".").slice(0, 2).join(".")

        if (major.length == 0 || major[major.length - 1].name != gameVersionName) {
            major.push({name: gameVersionName, contains: Array.from(version.contains)})
            continue
        }

        major[major.length - 1].contains.push(...version.contains)
    }

    return {
        all,
        minor,
        major
    }
}

export type SupportedVersions = {
    all: string[],
    major: string[],
    minor: string[]
}

export function getSupportedGameVersions(gameVersions: GameVersions, version: Version): SupportedVersions {
    let data = {
        all: new Set<string>(),
        major: new Set<string>(),
        minor: new Set<string>()
    }

    for (let gameVersion of version.game_versions) {
        data.all.add(gameVersion)

        for (let majorVersion of gameVersions.major) {
            if (majorVersion.contains.includes(gameVersion)) {
                data.major.add(majorVersion.name)
            }
        }

        for (let minorVersion of gameVersions.minor) {
            if (minorVersion.contains.includes(gameVersion)) {
                data.minor.add(minorVersion.name)
            }
        }
    }

    return {
        all: Array.from(data.all),
        major: Array.from(data.major),
        minor: Array.from(data.minor)
    }
}