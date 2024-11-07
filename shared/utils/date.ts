export function dateToKey(date: Date): string {
	return `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
}

export function dateToFormatted(date: Date): string {
	return `${date.getUTCFullYear()} ${date.getUTCMonth() + 1} ${date.getUTCDate()}`;
}

export function keyToDate(key: string): Date {
	const [year, month, day] = key.split("-").map(Number);
	return new Date(Date.UTC(year as number, (month as number) - 1, day));
}
