export type ProjectData = {
	id: string;
	name: string;
	description: string;
	icon_url: string | null;
	downloads: number;
};

export type ExtendedProjectData = ProjectData & {
	latest_version: string;
};

export type Connection = {
	project_id: string;
	dependency_id: string;
};
