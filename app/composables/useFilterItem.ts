export function useFilterNullableItem(
	key: string,
	defaultValue: string | undefined | Ref<string | undefined>,
) {
	const route = useRoute();
	const router = useRouter();

	const defaultValueRef = toRef(defaultValue);

	const item = ref(
		(route.query[key] ? route.query[key] as string : defaultValueRef.value),
	);

	watch(defaultValueRef, () => {
		item.value = defaultValueRef.value;
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

export function useFilterItem(
	key: string,
	defaultValue: string | undefined | Ref<string | undefined>,
) {
	const item = useFilterNullableItem(key, defaultValue);
	return computed({
		get: () => item.value as string,
		set: (value) => (item.value = value),
	});
}
