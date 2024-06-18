import {Stats} from "~/server/utils/types/stats";
import {GameVersion, Version} from "~/server/utils/fetchData";

type StatsData = Map<string, Map<string, { downloads: number, count: number }>>

export async function updateStatistics() {
    const projectIds = await getProjectIds(0);
    console.log("project ids", projectIds.length);

    const versionIds = (await getVersionIds(projectIds))
    console.log("version ids", versionIds.length);

    let data: StatsData = new Map()
    await analyzeVersionsFromIds(versionIds, data);

    let versions = await getGameVersions()

    let allDownloads = StatsFromData(versions, data);
    let {gameVersions: minorGameVersions, downloads: minorVersionDownloads} = onlyMinorVersions(versions, allDownloads);
    let majorVersionDownloads = onlyMajorVersions(minorGameVersions, minorVersionDownloads);

    const storage = useStorage("statistics");
    await storage.setItem<Stats>("versionStatsAll", allDownloads)
    await storage.setItem<Stats>("versionStatsMinor", minorVersionDownloads)
    await storage.setItem<Stats>("versionStatsMajor", majorVersionDownloads)
}

async function analyzeVersionsFromIds(versionIds: string[], data: StatsData) {
    const BATCH_SIZE = 1000;

    let currentIndex = 0;

    while (true) {
        const ids = versionIds.slice(currentIndex, currentIndex + BATCH_SIZE);
        currentIndex += BATCH_SIZE

        const versions = await getVersions(ids)
        console.log("versions", versions.length);

        analyzeVersions(versions, data);
        if (ids.length != BATCH_SIZE)
            break
    }
}

function analyzeVersions(versions: Version[], data: StatsData) {
    for (let version of versions) {

        // compensate for a version contributing to multiple loaders and versions
        let versionDownloads = version.downloads / (version.loaders.length * version.game_versions.length)

        for (let loader of version.loaders) {
            if (!isAllowedModLoader(loader)) {
                continue
            }

            let downloads = new Map<string, { downloads: number, count: number }>();

            if (data.has(loader)) {
                downloads = data.get(loader)!;
            } else {
                data.set(loader, downloads)
            }

            for (let gameVersion of version.game_versions) {
                if (downloads.has(gameVersion)) {
                    let data = downloads.get(gameVersion)!;

                    downloads.set(gameVersion, {downloads: data.downloads + versionDownloads, count: data.count + 1})
                } else {
                    downloads.set(gameVersion, {downloads: versionDownloads, count: 1})
                }
            }
        }
    }
}

function onlyMinorVersions(gameVersions: GameVersion[], all: Stats): {
    gameVersions: GameVersion[],
    downloads: Stats
} {
    const versions = Array.from(gameVersions)
    const downloads: Stats = JSON.parse(JSON.stringify(all))

    let index = 0

    while (true) {
        if (index == versions.length)
            break

        let gameVersion = versions[index];

        if (gameVersion.fullVersion) {
            index++
            continue
        }

        for (let loader of downloads.data) {
            let stats = loader.values.splice(index, 1);

            if (index + 1 >= loader.values.length) {
                continue
            }

            loader.values[index + 1].count += stats[0].count
            loader.values[index + 1].downloads += stats[0].downloads
        }

        versions.splice(index, 1)
        downloads.versions.splice(index, 1)
    }

    return {gameVersions: versions, downloads: downloads}
}

function onlyMajorVersions(gameVersions: GameVersion[], all: Stats): Stats {
    const versions = Array.from(gameVersions)
    const downloads: Stats = JSON.parse(JSON.stringify(all))

    let index = versions.length - 1

    while (true) {
        if (index == -1)
            break

        let gameVersion = versions[index];

        if (gameVersion.name.split(".").length == 2) {
            index--
            continue
        }

        for (let loader of downloads.data) {
            let stats = loader.values.splice(index, 1);

            if (index - 1 < 0) {
                continue
            }

            loader.values[index - 1].count += stats[0].count
            loader.values[index - 1].downloads += stats[0].downloads
        }

        versions.splice(index, 1)
        downloads.versions.splice(index, 1)
    }

    return downloads
}

function StatsFromData(versions: GameVersion[], data: StatsData): Stats {
    const versionArray = versions.map(value => {
        return value.name
    })

    const loaderData = []

    for (let loader of data) {
        let downloadsMap = loader[1];
        let downloads = []

        for (let version of versionArray) {
            if (downloadsMap.has(version)) {
                downloads.push(downloadsMap.get(version)!);
            } else {
                downloads.push({downloads: 0, count: 0})
            }
        }

        downloads = downloads.map((value) => {
            return {
                downloads: Math.round(value.downloads),
                count: value.count
            }
        })

        loaderData.push({
            name: loader[0],
            values: downloads
        })
    }

    return {versions: versionArray, data: loaderData}
}