import { describe, expect, it } from "vitest";
import { groupGameVersions } from "~~/server/utils/processing/gameVersions/processing";

const versions: GameVersion[] = [
	// 1.21.5 snapshots
	{ name: "1.21.5-snapshot-1", fullVersion: false },
	{ name: "1.21.5-snapshot-2", fullVersion: false },
	{ name: "1.21.5", fullVersion: true },

	// 1.21.6 snapshots
	{ name: "1.21.6-snapshot-1", fullVersion: false },
	{ name: "1.21.6", fullVersion: true },

	// 1.22
	{ name: "1.22-snapshot-1", fullVersion: false },
	{ name: "1.22", fullVersion: true },

	// 26.1
	{ name: "26.1-snapshot-1", fullVersion: false },
	{ name: "26.1", fullVersion: true },
	{ name: "26.1.1-snapshot-1", fullVersion: false },
	{ name: "26.1.1", fullVersion: true },

	// 26.2
	{ name: "26.2-snapshot-1", fullVersion: false },
	{ name: "26.2", fullVersion: true },
];

describe("groupGameVersions", () => {
	it("groups all versions individually", () => {
		const result = groupGameVersions(versions);

		expect(result.all).toEqual(
			versions.map((v) => ({
				name: v.name,
				contains: [v.name],
			})),
		);
	});

	it("groups minor versions correctly", () => {
		const result = groupGameVersions(versions);

		expect(result.minor).toEqual([
			{
				name: "1.21.5",
				contains: ["1.21.5-snapshot-1", "1.21.5-snapshot-2", "1.21.5"],
			},
			{
				name: "1.21.6",
				contains: ["1.21.6-snapshot-1", "1.21.6"],
			},
			{
				name: "1.22",
				contains: ["1.22-snapshot-1", "1.22"],
			},
			{
				name: "26.1",
				contains: ["26.1-snapshot-1", "26.1", "26.1.1-snapshot-1", "26.1.1"],
			},
			{
				name: "26.2",
				contains: ["26.2-snapshot-1", "26.2"],
			},
		]);
	});

	it("groups major versions correctly", () => {
		const result = groupGameVersions(versions);

		expect(result.major).toEqual([
			{
				name: "1.21",
				contains: [
					"1.21.5-snapshot-1",
					"1.21.5-snapshot-2",
					"1.21.5",
					"1.21.6-snapshot-1",
					"1.21.6",
				],
			},
			{
				name: "1.22",
				contains: ["1.22-snapshot-1", "1.22"],
			},
			{
				name: "26",
				contains: [
					"26.1-snapshot-1",
					"26.1",
					"26.1.1-snapshot-1",
					"26.1.1",
					"26.2-snapshot-1",
					"26.2",
				],
			},
		]);
	});

	it("creates a unified group containing all versions", () => {
		const result = groupGameVersions(versions);

		expect(result.unified).toEqual([
			{
				name: "unified",
				contains: versions.map((v) => v.name),
			},
		]);
	});
});
