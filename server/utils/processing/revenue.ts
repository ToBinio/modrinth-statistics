export async function getRevenue(): Promise<Revenue[]> {
	type RawRevenue = {
		time: number;
		revenue: string;
		creator_revenue: string;
	};

	const data = await $modrinthV3Fetch<{ data: RawRevenue[] }>(
		"/payout/platform_revenue",
	);

	return data.data.map((value) => {
		return {
			time: new Date(value.time * 1000),
			modrinth_revenue: Number(value.revenue),
			creator_revenue: Number(value.creator_revenue),
		};
	});
}

export type Revenue = {
	time: Date;
	modrinth_revenue: number;
	creator_revenue: number;
};
