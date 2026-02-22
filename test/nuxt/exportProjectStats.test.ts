import { describe, expect, it, vi } from "vitest";
import { exportStatsOverTime } from "~~/server/utils/api/export/projectStats";
import type { ProjectTypes } from "~~/shared/utils/project";

describe("exportProjectStats", () => {
	it("can handle no data", async () => {
		vi.mock(import("~~/server/utils/db/kv"), () => {
			return {
				KV: {
					ProjectStats: {
						getBulk: async (
							_dates: Date[],
							_type: ProjectTypes,
							_versionCategory: VersionCategories,
							_exclusive: boolean,
						): Promise<(ProjectStats | Error)[]> => {
							console.log("Mocked getBulk called");
							return [];
						},
					},
				},
			} as typeof import("~~/server/utils/db/kv");
		});

		const result = await exportStatsOverTime(
			"all",
			"mod",
			true,
			new Date("2025-01-01"),
			"1.21.1",
			(data) => {
				return data.count;
			},
			undefined,
		);

		expect(result.data.length).toBe(0);
	});
});
