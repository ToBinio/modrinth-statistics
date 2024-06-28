export type Version = "major" | "minor" | "all"

export function useVersion() {
    let cookie = useCookie<Version>("version", {maxAge: 60 * 60 * 24 * 30});

    if (!cookie.value) {
        cookie.value = "major"
    }

    return cookie
}