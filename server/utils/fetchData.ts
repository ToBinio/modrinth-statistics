import {$modrinthFetch} from "~/utils/modrinthFetch";

export async function getProjectIds(offset: number): Promise<string[]> {
    const data = await $modrinthFetch<SimpleProjects>("/search", {
        query: {
            limit: 100,
            offset: offset,
            //todo - remove newest
            // index: "newest",
            facets: "[[\"project_types:mod\"]]"
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

type Version = {
    loaders: string[]
    game_versions: string[]
    downloads: number
}