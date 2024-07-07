import type { UseFetchOptions } from "#app";

export function useModrinthFetch<T>(
	url: string | (() => string),
	options: UseFetchOptions<T> = {},
) {
	return useFetch(url, {
		...options,
		$fetch: $modrinthFetch,
	});
}
