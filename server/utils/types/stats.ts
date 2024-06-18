export type Stats = {
    versions: string[]
    data: {
        name: string
        values: { downloads: number, count: number }[]
    }[]
}