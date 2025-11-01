import consola from "consola";

export default defineNitroPlugin(async () => {
	const db = useDatabase();

	//TODO: handle via migrations
	await db.sql`DROP TABLE IF EXISTS connections`;
	await db.sql`DROP TABLE IF EXISTS modpacks`;

	await db.sql`CREATE TABLE IF NOT EXISTS connections (
		project_id VARCHAR(8),
		dependency_id VARCHAR(8),
		PRIMARY KEY (project_id, dependency_id)
	)`;
	await db.sql`CREATE TABLE IF NOT EXISTS modpacks (
		id VARCHAR(8) PRIMARY KEY,
		name TEXT,
		description TEXT,
		icon_url TEXT,
		downloads INTEGER
	)`;

	consola.info("Database initialized");
});
