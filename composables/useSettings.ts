export type Version = "major" | "minor" | "all"

export function useSettings() {
    let version = useCookie<Version>("version", {
        maxAge: 60 * 60 * 24 * 30, sameSite: true, default: () => {
            return "major";
        },
    });
    let exclusive = useCookie<boolean>("exclusive", {
        maxAge: 60 * 60 * 24 * 30, sameSite: true, default: () => {
            return false;
        },
    });

    return {version, exclusive}
}