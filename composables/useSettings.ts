export type Version = "major" | "minor" | "all";

export function useSettings() {
	const version = useCookie<Version>("version", {
		maxAge: 60 * 60 * 24 * 30,
		sameSite: true,
		default: () => {
			return "major";
		},
	});
	const exclusive = useCookie<boolean>("exclusive", {
		maxAge: 60 * 60 * 24 * 30,
		sameSite: true,
		default: () => {
			return false;
		},
	});

	return { version, exclusive };
}
