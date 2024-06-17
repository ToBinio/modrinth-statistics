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
    let downloads = await storage.getItem<Downloads>("majorVersionDownloads")

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

