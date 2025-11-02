CREATE TABLE `connections` (
	`project_id` text(8) NOT NULL,
	`dependency_id` text(8) NOT NULL,
	PRIMARY KEY(`project_id`, `dependency_id`),
	FOREIGN KEY (`project_id`) REFERENCES `modpacks`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `modpacks` (
	`id` text(8) PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`icon_url` text,
	`downloads` integer NOT NULL
);
