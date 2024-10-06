export function useFilterItem(
	key: string,
	defaultValue: string | undefined | Ref<string | undefined>,
) {
	const route = useRoute();
	const router = useRouter();

	const defaultValueRef = toRef(defaultValue);

	const item = ref(
		(route.query[key] ? route.query[key] : defaultValueRef.value) as string,
	);

	watch(defaultValueRef, () => {
		item.value = defaultValueRef.value as string;
	});

	watch(item, async () => {
		await router.replace({
			query: {
				...route.query,
				[key]: item.value === defaultValueRef.value ? undefined : item.value,
			},
		});
	});

	return item;
}
