export const $modrinthFetch = $fetch.create({
    headers: {"User-Agent": "ToBinio/modrinth-statistics"},
    baseURL: "https://api.modrinth.com/v2/"
})