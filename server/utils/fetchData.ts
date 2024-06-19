import {$modrinthFetch} from "~/utils/modrinthFetch";

export async function getProjectIds(offset: number, type: string, limit: number): Promise<string[]> {
    const data = await $modrinthFetch<SimpleProjects>("/search", {
        query: {
            limit: limit,
            offset: offset,
            index: import.meta.dev ? "newest" : "downloads",
            facets: `[[\"project_types:${type}\"]]`
        }
    })

    return data.hits.map(value => value.project_id)
}

type SimpleProjects = {
    hits: { project_id: string }[]
}

export async function getVersionIds(projectIds: string[]): Promise<string[]> {
    const data = await $modrinthFetch<Project[]>("/projects", {
        query: {
            ids: "[\"" + projectIds.join("\",\"") + "\"]"
        }
    })

    return data.flatMap(value => value.versions)
}

type Project = {
    versions: string[]
}

export async function getVersions(versionIds: string[]): Promise<Version[]> {
    const data = await $modrinthFetch<Version[]>("/versions", {
        query: {
            ids: "[\"" + versionIds.join("\",\"") + "\"]"
        }
    })

    //done to remove unused values from the ram
    return data.flatMap(value => {
        return {
            loaders: value.loaders,
            game_versions: value.game_versions,
            downloads: value.downloads
        }
    })
}

export type Version = {
    loaders: string[]
    game_versions: string[]
    downloads: number
}

export async function getGameVersions(): Promise<GameVersion[]> {
    const data = await $modrinthFetch<{
        version: string,
        version_type: string
    }[]>("/tag/game_version")

    return data.map(value => {
        return {
            name: value.version,
            fullVersion: value.version_type == "release"
        }
    }).toReversed()
}

export type GameVersion = {
    name: string,
    fullVersion: boolean,
}