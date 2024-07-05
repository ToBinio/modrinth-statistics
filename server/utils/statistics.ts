import {Stats, StatsValue} from "~/server/utils/types/stats";
import {GameVersion, Version} from "~/server/utils/fetchData";
import {projectTypeList, ProjectTypes} from "~/utils/project";
import consola from "consola";

type StatsDataEntry = Map<string, Map<string, {
    downloads: number,
    versions: number,
    unique_projects: Set<string>
}>>
type StatsData = { all: StatsDataEntry, exclusive: StatsDataEntry }

type AllStatsEntry = { all: Stats, minor: Stats, major: Stats };
type AllStats = { all: AllStatsEntry, exclusive: AllStatsEntry }

type GroupStats = {
    versions: string[]
    data: {
        name: string
        values: {
            downloads: number,
            versions: number,
            unique_projects: Set<string>
        }[]
    }[]
}


export async function updateStatistics() {
    for (let type of projectTypeList) {
        await updateStatistic(type)
    }
}

async function updateStatistic(type: ProjectTypes) {
    consola.log(`analyzing - ${type}`)
    const stats = await getStatistics(type)
    await saveStats(stats, type)
}

async function saveStats(stats: AllStats, type: ProjectTypes) {
    const storage = useStorage("statistics");

    await storage.setItem<Stats>(`${type}StatsAll`, stats.all.all)
    await storage.setItem<Stats>(`${type}StatsMinor`, stats.all.minor)
    await storage.setItem<Stats>(`${type}StatsMajor`, stats.all.major)

    await storage.setItem<Stats>(`${type}StatsAllExclusive`, stats.exclusive.all)
    await storage.setItem<Stats>(`${type}StatsMinorExclusive`, stats.exclusive.minor)
    await storage.setItem<Stats>(`${type}StatsMajorExclusive`, stats.exclusive.major)
}

async function getStatistics(type: ProjectTypes): Promise<AllStats> {
    const BATCH_COUNT = import.meta.dev ? 1 : 10;
    let data: StatsData = {all: new Map(), exclusive: new Map()}

    let index = 0;

    while (true) {
        let done = false;

        const batchProjectIds = []
        for (let i = 0; i < BATCH_COUNT; i++) {
            const projectIds = await getProjectIds(index, type, 100);
            batchProjectIds.push(...projectIds);
            index += 100;

            if (projectIds.length != 100) {
                done = true;
                break
            }
        }

        const versionIds = (await getVersionIds(batchProjectIds))

        await analyzeVersionsFromIds(versionIds, data, type);

        if (done || import.meta.dev) break
    }

    let versions = await getGameVersions()

    function toVersions(data: StatsDataEntry): AllStatsEntry {
        let allDownloads = StatsFromData(versions, data);
        let {
            gameVersions: minorGameVersions,
            downloads: minorVersionDownloads
        } = onlyMinorVersions(versions, allDownloads);
        let majorVersionDownloads = onlyMajorVersions(minorGameVersions, minorVersionDownloads);

        return {
            all: groupStatsToStats(allDownloads),
            minor: groupStatsToStats(minorVersionDownloads),
            major: groupStatsToStats(majorVersionDownloads)
        };
    }

    return {
        all: toVersions(data.all),
        exclusive: toVersions(data.exclusive)
    }
}

function groupStatsToStats(groupStats: GroupStats): Stats {
    return {
        versions: groupStats.versions,
        data: groupStats.data.map(value => {
            return {
                name: value.name,
                values:
                    value.values.map(value1 => {
                        return {
                            downloads: value1.downloads,
                            versions: value1.versions,
                            count: value1.unique_projects.size
                        }
                    })
            }
        })
    }
}

async function analyzeVersionsFromIds(versionIds: string[], data: StatsData, type: ProjectTypes) {
    const BATCH_SIZE = 1000;

    let currentIndex = 0;

    while (true) {
        const ids = versionIds.slice(currentIndex, currentIndex + BATCH_SIZE);
        currentIndex += BATCH_SIZE

        const versions = await getVersions(ids)

        analyzeVersions(versions, data, type);
        if (ids.length != BATCH_SIZE)
            break
    }
}

function analyzeVersions(versions: Version[], data: StatsData, type: ProjectTypes) {
    for (let version of versions) {
        let allowedLaunchers = version.loaders.filter(value => isAllowedModLoader(value, type));

        // compensate for a version contributing to multiple loaders and versions
        let versionDownloads = version.downloads / (allowedLaunchers.length * version.game_versions.length)

        insertLauncherData(allowedLaunchers, data.all, version, versionDownloads);
        if (allowedLaunchers.length == 1) {
            insertLauncherData(allowedLaunchers, data.exclusive, version, versionDownloads);
        }
    }
}

function insertLauncherData(allowedLaunchers: Array<string>, data: StatsDataEntry, version: Version, versionDownloads: number) {
    for (let loader of allowedLaunchers) {
        if (!data.has(loader)) {
            data.set(loader, new Map())
        }

        let downloads = data.get(loader)!;

        for (let gameVersion of version.game_versions) {
            if (downloads.has(gameVersion)) {
                let data = downloads.get(gameVersion)!;

                data.unique_projects.add(version.project_id)
                downloads.set(gameVersion, {
                    downloads: data.downloads + versionDownloads,
                    versions: data.versions + 1,
                    unique_projects: data.unique_projects
                })
            } else {
                let set = new Set<string>();

                downloads.set(gameVersion, {
                    downloads: versionDownloads,
                    versions: 1,
                    unique_projects: set
                })
            }
        }
    }
}

function onlyMinorVersions(gameVersions: GameVersion[], all: GroupStats): {
    gameVersions: GameVersion[],
    downloads: GroupStats
} {
    const versions = Array.from(gameVersions)
    const downloads: GroupStats = structuredClone(all)

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

            loader.values[index].versions += stats[0].versions
            loader.values[index].downloads += stats[0].downloads
            for (let uniqueProject of stats[0].unique_projects) {
                loader.values[index].unique_projects.add(uniqueProject)
            }
        }

        versions.splice(index, 1)
        downloads.versions.splice(index, 1)
    }

    return {gameVersions: versions, downloads: downloads}
}

function onlyMajorVersions(gameVersions: GameVersion[], all: GroupStats): GroupStats {
    const versions = Array.from(gameVersions)
    const downloads = structuredClone(all)


    let index = 0
    let currentVersion = versions[0].name.split(".").slice(0, 2).join(".")

    while (true) {
        if (index == (versions.length - 1)) {
            downloads.versions[index] = currentVersion
            break
        }

        let nextGameVersions = versions[index + 1].name.split(".").slice(0, 2).join(".")

        if (currentVersion != nextGameVersions) {
            downloads.versions[index] = currentVersion
            currentVersion = nextGameVersions;
            index++
            continue
        }

        currentVersion = nextGameVersions;

        for (let loader of downloads.data) {
            let stats = loader.values.splice(index, 1);

            loader.values[index].versions += stats[0].versions
            loader.values[index].downloads += stats[0].downloads
            for (let uniqueProject of stats[0].unique_projects) {
                loader.values[index].unique_projects.add(uniqueProject)
            }
        }

        versions.splice(index, 1)
        downloads.versions.splice(index, 1)
    }

    return downloads
}

function StatsFromData(versions: GameVersion[], data: StatsDataEntry): GroupStats {
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
                downloads.push({downloads: 0, versions: 0, unique_projects: new Set<string>()})
            }
        }

        downloads = downloads.map((value) => {
            return {
                downloads: Math.round(value.downloads),
                versions: value.versions,
                unique_projects: value.unique_projects
            }
        })

        loaderData.push({
            name: loader[0],
            values: downloads
        })
    }

    loaderData.sort((a, b) => a.name.localeCompare(b.name))

    return {versions: versionArray, data: loaderData}
}