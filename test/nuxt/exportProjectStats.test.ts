import { beforeEach, describe, expect, it, vi } from "vitest";
import { exportStatsOverTime } from "~~/server/utils/api/export/projectStats";
import type { ProjectTypes } from "~~/shared/utils/project";

const mockGetBulk = vi.hoisted(() => vi.fn());

vi.mock("~~/server/utils/db/kv", async () => {
	return {
		KV: {
			ProjectStats: {
				getBulk: mockGetBulk,
			},
		},
	};
});

describe("exportProjectStats", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("can handle no data", async () => {
		mockGetBulk.mockResolvedValue([]);

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

	it("can handle no error", async () => {
		mockGetBulk.mockImplementation(
			async (dates: Date[]): Promise<(ProjectStats | Error)[]> => {
				return dates.map((_) => {
					return new Error("Mock error");
				});
			},
		);
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

	it("correctly passes values", async () => {
		mockGetBulk.mockImplementation(
			async (
				_dates: Date[],
				type: ProjectTypes,
				versionCategory: VersionCategories,
				exclusive: boolean,
			): Promise<(ProjectStats | Error)[]> => {
				expect(type).toBe("mod");
				expect(versionCategory).toBe("all");
				expect(exclusive).toBe(true);

				return [];
			},
		);

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
