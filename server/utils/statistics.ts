export async function updateStatistics() {
    const projectIds = await getProjectIds(0);
    console.log("project ids", projectIds.length);

    const versionIds = (await getVersionIds(projectIds))
    console.log("version ids", versionIds.length);

    let data = new Map<string, Map<string, number>>()
    let versions = await getGameVersions()

    await insertVersionsFromIds(versionIds, data);

    let allDownloads = downloadsFromData(versions, data);
    let {gameVersions: minorGameVersions, downloads: minorVersionDownloads} = onlyMinorVersions(versions, allDownloads);
    let majorVersionDownloads = onlyMajorVersions(minorGameVersions, minorVersionDownloads);

    const storage = useStorage("statistics");
    await storage.setItem<Downloads>("allVersionDownloads", allDownloads)
    await storage.setItem<Downloads>("minorVersionDownloads", minorVersionDownloads)
    await storage.setItem<Downloads>("majorVersionDownloads", majorVersionDownloads)
}

async function insertVersionsFromIds(versionIds: string[], data: Map<string, Map<string, number>>) {
    const BATCH_SIZE = 1000;

    let currentIndex = 0;

    while (true) {
        const ids = versionIds.slice(currentIndex, currentIndex + BATCH_SIZE);
        currentIndex += BATCH_SIZE

        const versions = await getVersions(ids)
        console.log("versions", versions.length);

        insertVersions(versions, data);
        if (ids.length != BATCH_SIZE)
            break
    }
}

function insertVersions(versions: Version[], data: Map<string, Map<string, number>>) {
    for (let version of versions) {

        // compensate for a version contributing to multiple loaders and versions
        let versionDownloads = version.downloads / (version.loaders.length * version.game_versions.length)

        for (let loader of version.loaders) {
            if (!isAllowedModLoader(loader)) {
                continue
            }

            let downloads = new Map<string, number>();

            if (data.has(loader)) {
                downloads = data.get(loader)!;
            } else {
                data.set(loader, downloads)
            }

            for (let gameVersion of version.game_versions) {
                if (downloads.has(gameVersion)) {
                    downloads.set(gameVersion, downloads.get(gameVersion)! + versionDownloads)
                } else {
                    downloads.set(gameVersion, versionDownloads)
                }
            }
        }
    }
}


function onlyMinorVersions(gameVersions: GameVersion[], all: Downloads): {
    gameVersions: GameVersion[],
    downloads: Downloads
} {
    const versions = Array.from(gameVersions)
    const downloads: Downloads = JSON.parse(JSON.stringify(all))

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
            let downloads = loader.downloads.splice(index, 1);

            if (index + 1 >= loader.downloads.length) {
                continue
            }

            loader.downloads[index + 1] += downloads[0]
        }

        versions.splice(index, 1)
        downloads.versions.splice(index, 1)
    }

    return {gameVersions: versions, downloads: downloads}
}

function onlyMajorVersions(gameVersions: GameVersion[], all: Downloads): Downloads {
    const versions = Array.from(gameVersions)
    const downloads: Downloads = JSON.parse(JSON.stringify(all))

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
            let downloads = loader.downloads.splice(index, 1);

            if (index - 1 < 0) {
                continue
            }

            loader.downloads[index - 1] += downloads[0]
        }

        versions.splice(index, 1)
        downloads.versions.splice(index, 1)
    }

    return downloads
}

function downloadsFromData(versions: GameVersion[], data: Map<string, Map<string, number>>): Downloads {
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
                downloads.push(0)
            }
        }

        downloads = downloads.map((value) => {
            return Math.round(value)
        })

        loaderData.push({
            name: loader[0],
            downloads: downloads
        })
    }

    return {versions: versionArray, data: loaderData}
}