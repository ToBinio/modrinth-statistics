import type { StatExport } from "~~/shared/types/types";

export function fracture(data: StatExport): StatExport {
	data.data.map((value) => {
		const data = [];

		for (let i = 0; i < value.data.length - 1; i++) {
			data.push(value.data[i + 1] - value.data[i]);
		}
		value.data = data;

		return value;
	});

	return data;
}
