import {Downloads} from "~/server/utils/types/downloads";

type result = {
    labels: string[]
    data: {
        name: string
        color: string,
        downloads: number[]
    }[]
}

export default defineEventHandler(async (event): Promise<result> => {
    const storage = useStorage();
    let query = getQuery(event);

    let downloads

    switch (query.mode) {
        case "minor" :
            downloads = await storage.getItem<Downloads>("minorVersionDownloads")
            break
        case "all" :
            downloads = await storage.getItem<Downloads>("allVersionDownloads")
            break
        default:
            downloads = await storage.getItem<Downloads>("majorVersionDownloads")
    }

    if (!downloads) {
        // todo - error message
        return {
            labels: [],
            data: []
        }
    }

    return {
        labels: downloads.versions,
        data: downloads.data.map(value => {
            return {
                name: value.name,
                color: getColorForLauncher(value.name),
                downloads: value.downloads
            }
        })
    }
})

