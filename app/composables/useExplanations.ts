export function useExplanations(key: string): string | undefined {
	switch (key.toLowerCase()) {
		case "versions": {
			return `
<h4>Number of Versions Supporting Each Loader/Game-Version</h4>
<br/>
Each version will be counted separately for every loader or game-version it supports. If a version supports multiple loaders or game-versions, it will be counted once for each supported loader/game-version.
`;
		}
		case "count": {
			return `
<h4>Number of Mods Supporting Each Loader/Game-Version</h4>
<br/>
Each mod will only be counted once. This means if a mod has 10 versions supporting a single versions in will still only be counted once.
`;
		}
		case "downloads": {
			return `
<h4>Number of Downloads per Specific Loader/Game-Version</h4>
<br/>
If a version supports multiple loaders or game-versions, the downloads will be divided equally among each supported loader/game-version.
<br/>
<br/>
This may exaggerate widely supported but less commonly used loaders or versions, such as Quilt.
`;
		}
	}
}
