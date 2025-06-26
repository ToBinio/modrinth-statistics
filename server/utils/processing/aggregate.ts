import type { StatExport } from "~~/shared/types/types";

// get data containing absolute values and convert it to data containing absolute difference
export function fracture(data: StatExport): StatExport {
	data.data.map((value) => {
		const data = [];

		for (let i = 0; i < value.data.length - 1; i++) {
			data.push(value.data[i + 1] - value.data[i]);
		}
		value.data = data;

		return value;
	});

	data.labels.pop();

	return data;
}

// summarize data to <count> values
export function summarize(
	data: StatExport,
	count: number,
	should_avg: boolean,
): StatExport {
	const per_group = data.labels.length / count;

	const indexes: number[] = [];
	for (let i = 0; i < data.labels.length; i++) {
		if (indexes.length * per_group <= i) {
			// insert reversed values so most recent data is always present
			indexes.push(data.labels.length - 1 - i);
		}
	}

	for (let i = 0; i < indexes.length; i++) {
		const from = indexes[i + 1] + 1 || 0;
		const to = indexes[i];

		for (const values of data.data) {
			const to_avg = values.data;

			let sum = 0;
			for (let j = from; j <= to; j++) {
				sum += to_avg[j];
			}

			const value = should_avg ? Math.round(sum / (to - from + 1)) : sum;
			to_avg.splice(from, to - from + 1, value);
		}
	}

	data.labels = data.labels.filter((_value, index) => indexes.includes(index));

	return data;
}
