import {
	integer,
	primaryKey,
	sqliteTable,
	text,
} from "drizzle-orm/sqlite-core";

export const connections = sqliteTable(
	"connections",
	{
		projectId: text("project_id", { length: 8 })
			.notNull()
			.references(() => modpacks.id),
		dependencyId: text("dependency_id", { length: 8 }).notNull(),
	},
	(table) => [primaryKey({ columns: [table.projectId, table.dependencyId] })],
);

export type NewConnection = typeof connections.$inferInsert;

export const modpacks = sqliteTable("modpacks", {
	id: text("id", { length: 8 }).primaryKey(),
	name: text("name").notNull(),
	description: text("description").notNull(),
	iconUrl: text("icon_url"),
	downloads: integer("downloads").notNull(),
});

export type NewModpack = typeof modpacks.$inferInsert;
