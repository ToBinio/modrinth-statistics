import {Downloads} from "~/server/utils/types/downloads";
import {Version} from "~/server/utils/fetchData";
import {isAllowedModLoader} from "~/server/utils/allowed";

export async function updateStatistics() {
    const projectIds = await getProjectIds(0);
    console.log("project ids", projectIds.length);

    const versionIds = (await getVersionIds(projectIds))
    console.log("version ids", versionIds.length);

    let data = new Map<string, Map<string, number>>()
    let versionsSet = new Set<string>()

    await insertVersionsFromIds(versionIds, data, versionsSet);

    let allDownloads = downloadsFromData(versionsSet, data);
    let minorVersionDownloads = onlyMinorVersions(allDownloads);
    let majorVersionDownloads = onlyMajorVersions(allDownloads);

    const storage = useStorage("statistics");
    await storage.setItem<Downloads>("allVersionDownloads", allDownloads)
    await storage.setItem<Downloads>("minorVersionDownloads", minorVersionDownloads)
    await storage.setItem<Downloads>("majorVersionDownloads", majorVersionDownloads)
}

async function insertVersionsFromIds(versionIds: string[], data: Map<string, Map<string, number>>, versionsSet: Set<string>) {
    const BATCH_SIZE = 1000;

    let currentIndex = 0;

    while (true) {
        const ids = versionIds.slice(currentIndex, currentIndex + BATCH_SIZE);
        currentIndex += BATCH_SIZE

        const versions = await getVersions(ids)
        console.log("versions", versions.length);

        insertVersions(versions, data, versionsSet);
        if (ids.length != BATCH_SIZE)
            break
    }
}

function insertVersions(versions: Version[], data: Map<string, Map<string, number>>, versionsSet: Set<string>) {
    for (let version of versions) {
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
                versionsSet.add(gameVersion);

                if (downloads.has(gameVersion)) {
                    downloads.set(gameVersion, downloads.get(gameVersion)! + version.downloads)
                } else {
                    downloads.set(gameVersion, version.downloads)
                }
            }
        }
    }
}


function onlyMinorVersions(all: Downloads): Downloads {

    let data = new Map<string, Map<string, number>>()
    let versionsSet = new Set<string>()

    for (let loader of all.data) {
        let downloads = new Map<string, number>();

        for (let i = 0; i < all.versions.length; i++) {
            let versionText = all.versions[i];

            //todo - dont somehow handle snapshot versions
            if (versionText.includes("w")) {
                continue
            }

            let version = versionText.split("-")[0];

            versionsSet.add(version);

            if (downloads.has(version)) {
                downloads.set(version, downloads.get(version)! + loader.downloads[i])
            } else {
                downloads.set(version, loader.downloads[i])
            }
        }

        data.set(loader.name, downloads)
    }

    return downloadsFromData(versionsSet, data);
}

function onlyMajorVersions(all: Downloads): Downloads {

    let data = new Map<string, Map<string, number>>()
    let versionsSet = new Set<string>()

    for (let loader of all.data) {
        let downloads = new Map<string, number>();

        for (let i = 0; i < all.versions.length; i++) {
            let versionText = all.versions[i];

            //todo - dont somehow handle snapshot versions
            if (versionText.includes("w")) {
                continue
            }

            let version = versionText.split("-")[0];
            version = version.split(".").slice(0, 2).join(".")

            versionsSet.add(version);

            if (downloads.has(version)) {
                downloads.set(version, downloads.get(version)! + loader.downloads[i])
            } else {
                downloads.set(version, loader.downloads[i])
            }
        }

        data.set(loader.name, downloads)
    }

    return downloadsFromData(versionsSet, data);
}

function downloadsFromData(versionsSet: Set<string>, data: Map<string, Map<string, number>>): Downloads {
    const versionArray = Array.from(versionsSet)
    versionArray.sort((a, b) => a.localeCompare(b, undefined, {numeric: true}))

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

        loaderData.push({
            name: loader[0],
            downloads: downloads
        })
    }

    return {versions: versionArray, data: loaderData}
}