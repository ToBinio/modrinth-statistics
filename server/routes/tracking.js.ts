export default defineEventHandler(async (event): Promise<string | null> => {
	const scriptText = await fetch("https://cloud.umami.is/script.js");

	setHeader(event, "Content-Type", "application/javascript");

	return await scriptText.text();
});
