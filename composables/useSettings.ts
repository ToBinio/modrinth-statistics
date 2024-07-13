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
	const versionTo = useCookie<string | undefined>("to", {
		maxAge: 60 * 60 * 24 * 30,
		sameSite: true,
		default: () => {
			return undefined;
		},
		decode(value) {
			return value;
		},
	});
	const versionFrom = useCookie<string | undefined>("from", {
		maxAge: 60 * 60 * 24 * 30,
		sameSite: true,
		default: () => {
			return undefined;
		},
		decode(value) {
			return value;
		},
	});

	return { version, exclusive, versionTo, versionFrom };
}
