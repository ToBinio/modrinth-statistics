import type { Connection, ProjectData } from "../processing/connections/types";

export const DB = {
	async clear(): Promise<Error | undefined> {
		const db = useDatabase();

		try {
			await db.sql`
				TRUNCATE TABLE connections;
			`;
		} catch (error) {
			return new Error(`Failed to clear database: ${error}`);
		}
	},
	//TODO: try catch within the function
	async getAllForProject(
		dependencyId: string,
		offset: number,
		limit: number,
	): Promise<ProjectData[] | Error> {
		const db = useDatabase();

		const result = await db.sql`
			SELECT id, name, description, icon_url, downloads FROM modpacks JOIN connections ON modpacks.id = connections.project_id WHERE dependency_id = ${dependencyId} ORDER BY downloads DESC LIMIT ${limit} OFFSET ${offset} ;
		`;

		if (!result.rows) {
			return new Error(
				`Failed to fetch connections for project ${dependencyId}: ${result.error}`,
			);
		}

		return result.rows.map((row) => {
			return {
				id: row.id as string,
				name: row.name as string,
				description: row.description as string,
				icon_url: row.icon_url as string,
				downloads: row.downloads as number,
			};
		});
	},
	async getCountForProject(dependencyId: string): Promise<number | Error> {
		const db = useDatabase();

		try {
			const result = await db.sql`
			SELECT COUNT(*) as count FROM connections WHERE dependency_id = ${dependencyId};
			`;

			if (!result.rows) {
				return new Error(
					`Failed to fetch connections for project ${dependencyId}: ${result.error}`,
				);
			}

			return result.rows[0].count as number;
		} catch (error) {
			return new Error(`Failed to add connections: ${error}`);
		}
	},
	async addConnectionsBulk(
		connections: Connection[],
	): Promise<Error | undefined> {
		const db = useDatabase();

		try {
			//TODO: dont use becouse of sql injection risk
			await db.sql`
				INSERT INTO connections (project_id, dependency_id)
				VALUES {${connections.map((connection) => `('${connection.project_id}', '${connection.dependency_id}')`).join(", ")}};
			`;
		} catch (error) {
			return new Error(`Failed to add connections: ${error}`);
		}
	},
	async addModpack(modpack: ProjectData): Promise<Error | undefined> {
		const db = useDatabase();

		try {
			await db.sql`
				INSERT INTO modpacks (id, name, description, icon_url, downloads)
				VALUES (${modpack.id}, ${modpack.name}, ${modpack.description}, ${modpack.icon_url}, ${modpack.downloads});
			`;
		} catch (error) {
			return new Error(`Failed to add modpack: ${error}`);
		}
	},
};
