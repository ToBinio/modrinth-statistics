import consola from "consola";

export default defineNitroPlugin(async () => {
	const db = useDatabase();

	//TODO: handle via migrations
	await db.sql`DROP TABLE IF EXISTS connections`;
	await db.sql`CREATE TABLE IF NOT EXISTS connections (
		project_id VARCHAR(8),
		dependency_id VARCHAR(8),
		PRIMARY KEY (project_id, dependency_id)
	)`;

	consola.info("Database initialized");
});
