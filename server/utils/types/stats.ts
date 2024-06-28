export type Stats = {
    versions: string[]
    data: {
        name: string
        values: StatsValue[]
    }[]
}

export type StatsValue = { downloads: number, versions: number }