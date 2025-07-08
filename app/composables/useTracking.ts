export function useTracking() {
	const config = useRuntimeConfig();
	useScriptUmamiAnalytics({
		websiteId: config.public.umamiId as string,
		scriptInput: {
			src: "/tracking.js",
		},
	});
}
