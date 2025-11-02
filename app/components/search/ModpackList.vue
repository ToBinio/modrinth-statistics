<script setup lang="ts">
	const props = defineProps({
		id: String,
	});

	watch(
		() => props.id,
		() => {
			reset();
			canLoadMore = true;
			data.value = [];
		},
	);

	const el = useTemplateRef<HTMLElement>("el");

	let canLoadMore = true;
	const data = ref<
		{
			id: string;
			name: string;
			description: string;
			icon_url: string | null;
			downloads: number;
		}[]
	>([]);

	const { reset } = useInfiniteScroll(
		el,
		async () => {
			const LIMIT = 10;

			const response = await $fetch("/api/reverseSearch/all", {
				params: {
					id: props.id,
					offset: data.value.length,
					limit: LIMIT,
				},
			});

			data.value.push(...response);
			canLoadMore = response.length >= LIMIT;
		},
		{
			distance: 500,
			canLoadMore: () => canLoadMore,
		},
	);
</script>
<template>
	<div ref="el" class="flex flex-col gap-4">
		<div
			v-for="modpack in data"
			:key="modpack.id"
			class="flex bg-zinc-800 rounded"
		>
			<img
				:src="modpack.icon_url ?? 'img/modrinthLogo.svg'"
				alt="Modpack Icon"
				class="w-20 h-20 rounded m-2 object-contain"
			>
			<div class="flex flex-col gap-1">
				<h3 class="text-2xl">{{ modpack.name }}</h3>
				<span>{{ modpack.description}}</span>
				<span> Downloads: {{ modpack.downloads}}</span>
			</div>
		</div>
	</div>
</template>
>
