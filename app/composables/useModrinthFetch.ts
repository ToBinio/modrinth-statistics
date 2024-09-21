import type { UseFetchOptions } from "#app";
import {$modrinthFetch} from "~~/utils/modrinthFetch";

export function useModrinthFetch<T>(
	url: string | (() => string),
	options: UseFetchOptions<T> = {},
) {
	return useFetch(url, {
		...options,
		$fetch: $modrinthFetch,
	});
}
