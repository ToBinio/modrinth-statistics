import { count, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import {
	connections,
	modpacks,
	type NewConnection,
	type NewModpack,
} from "~~/server/database/schema";
import type { ProjectData } from "../processing/connections/types";

let _drizzle: ReturnType<typeof drizzle>;
export function useDrizzle() {
	const url = useRuntimeConfig().db.url;

	if (!_drizzle) {
		_drizzle = drizzle({
			connection: {
				url: url,
			},
		});
	}

	return _drizzle;
}

//TODO: dont catch in functions or force error handling outside
export const DB = {
	async clear() {
		const db = useDrizzle();

		await db.delete(connections);
		await db.delete(modpacks);
	},
	async getAllForProject(
		dependencyId: string,
		offset: number,
		limit: number,
	): Promise<ProjectData[] | Error> {
		const db = useDrizzle();

		try {
			const result = await db
				.select({
					id: modpacks.id,
					name: modpacks.name,
					description: modpacks.description,
					iconUrl: modpacks.iconUrl,
					downloads: modpacks.downloads,
				})
				.from(modpacks)
				.leftJoin(connections, eq(modpacks.id, connections.projectId))
				.where(eq(connections.dependencyId, dependencyId))
				.orderBy(desc(modpacks.downloads))
				.limit(limit)
				.offset(offset);

			return result.map((row) => {
				return {
					id: row.id,
					name: row.name,
					description: row.description,
					icon_url: row.iconUrl,
					downloads: row.downloads,
				};
			});
		} catch (error) {
			return new Error(`Failed to fetch modpacks: ${error}`);
		}
	},
	async getCountForProject(dependencyId: string): Promise<number | Error> {
		const db = useDrizzle();

		try {
			const result = await db
				.select({ count: count() })
				.from(connections)
				.where(eq(connections.dependencyId, dependencyId));

			if (!result[0]) {
				return new Error(`Failed to fetch count for project ${dependencyId}`);
			}

			return result[0]!.count;
		} catch (error) {
			return new Error(`Failed to add connections: ${error}`);
		}
	},
	async addConnectionsBulk(
		newConnections: NewConnection[],
	): Promise<Error | undefined> {
		const db = useDrizzle();

		try {
			await db.insert(connections).values(newConnections);
		} catch (error) {
			return new Error(`Failed to add connections: ${error}`);
		}
	},
	async addModpacksBulk(newModpacks: NewModpack[]): Promise<Error | undefined> {
		const db = useDrizzle();

		try {
			await db.insert(modpacks).values(newModpacks);
		} catch (error) {
			return new Error(`Failed to add modpack: ${error}`);
		}
	},
};
