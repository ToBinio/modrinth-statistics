import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "sqlite",
	dbCredentials: {
		//TODO: read from env
		url: "./.data/db.sqlite",
	},
	schema: "./server/database/schema.ts",
	out: "./server/database/migrations",
});
