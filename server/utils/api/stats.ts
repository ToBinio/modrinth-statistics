import {Stats, StatsValue} from "~/server/utils/types/stats";
import {ProjectTypes} from "~/utils/project";

export type StatExport = {
    labels: string[]
    data: {
        label: string
        backgroundColor: string,
        data: number[]
    }[]
}

export async function exportStats(mode: string, type: ProjectTypes, fn: (value: StatsValue) => number): Promise<StatExport> {
    const storage = useStorage("statistics");
    let stats

    switch (mode) {
        case "minor" :
            stats = await storage.getItem<Stats>(`${type}StatsMinor`)
            break
        case "all" :
            stats = await storage.getItem<Stats>(`${type}StatsAll`)
            break
        default:
            stats = await storage.getItem<Stats>(`${type}StatsMajor`)
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
                    return fn(stat)
                })
            }
        })
    }
}