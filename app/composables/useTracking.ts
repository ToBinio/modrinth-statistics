let global_proxy: ReturnType<typeof useScriptUmamiAnalytics> | undefined;

export function useTracking() {
	const config = useRuntimeConfig();

	if (global_proxy) {
		return { proxy: global_proxy.proxy };
	}

	const umami = useScriptUmamiAnalytics({
		websiteId: config.public.umamiID as string,

		scriptInput: {
			src: "/tracking.js",
		},
	});

	global_proxy = umami;
	return { proxy: umami.proxy };
}
