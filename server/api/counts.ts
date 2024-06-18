import {Stats} from "~/server/utils/types/stats";

type result = {
    labels: string[]
    data: {
        label: string
        backgroundColor: string,
        data: number[]
    }[]
}

export default defineEventHandler(async (event): Promise<result> => {
    const storage = useStorage("statistics");
    let query = getQuery(event);

    let stats

    switch (query.mode) {
        case "minor" :
            stats = await storage.getItem<Stats>("versionStatsMinor")
            break
        case "all" :
            stats = await storage.getItem<Stats>("versionStatsAll")
            break
        default:
            stats = await storage.getItem<Stats>("versionStatsMajor")
    }

    if (!stats) {
        // todo - error message
        return {
            labels: [],
            data: []
        }
    }

    return {
        labels: stats.versions,
        data: stats.data.map(value => {
            return {
                label: value.name,
                backgroundColor: getColorForLauncher(value.name),
                data: value.values.map((stat) => {
                    return stat.count
                })
            }
        })
    }
})

