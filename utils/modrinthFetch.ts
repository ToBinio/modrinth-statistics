import { ofetch } from "ofetch";

export const $modrinthFetch = ofetch.create({
	headers: { "User-Agent": "ToBinio/modrinth-statistics" },
	baseURL: "https://api.modrinth.com/v2/",
});
