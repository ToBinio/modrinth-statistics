import type { Connection } from "../processing/connections/types";

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
	async getForProject(dependencyId: string): Promise<string[] | Error> {
		const db = useDatabase();

		const result = await db.sql`
			SELECT project_id FROM connections WHERE dependency_id = ${dependencyId};
		`;

		if (!result.rows) {
			return new Error(
				`Failed to fetch connections for project ${dependencyId}: ${result.error}`,
			);
		}

		return result.rows.map((row) => {
			return row.project_id as string;
		});
	},
	async addBulk(connections: Connection[]): Promise<Error | undefined> {
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
};
