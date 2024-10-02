export function useFilterItem(key: string, defaultValue: string | undefined) {
	const route = useRoute();
	const router = useRouter();

	const item = ref(
		(route.query[key] ? route.query[key] : defaultValue) as string,
	);

	watch(item, async () => {
		await router.replace({
			query: {
				...route.query,
				[key]: item.value,
			},
		});
	});

	return item;
}
