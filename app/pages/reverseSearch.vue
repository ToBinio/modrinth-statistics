<script setup lang="ts">
	import ModpackList from "~/components/search/ModpackList.vue";

	const route = useRoute();
	const router = useRouter();

	const input = ref((route.query.id as string) || "");
	const currentId = ref(input.value);

	const { data: count } = useFetch("/api/reverseSearch/count", {
		params: {
			id: currentId,
		},
	});

	async function search() {
		currentId.value = input.value;

		await router.replace({
			query: {
				...route.query,
				id: currentId.value,
			},
		});
	}
</script>
<template>
	<div class="flex flex-1 flex-col">
		<div class="flex flex-col gap-5 items-center mt-4">
			<span class="text-3xl">Find all Modpacks which include the Project</span>
			<form
				class="border border-gray-300 rounded-md flex"
				@submit.prevent="search"
			>
				<input
					class="pl-1.5"
					v-model="input"
					type="text"
					placeholder="Project ID..."
				>
				<button class="border-l flex items-center p-1 group" type="submit">
					<Icon
						class="group-hover:scale-110 transition"
						name="akar-icons:search"
						size="20"
					/>
				</button>
			</form>
		</div>
		<div class="flex flex-col flex-1 mx-4 gap-4">
			<div class="text-2xl">Modpacks: {{ count?.count }}</div>
			<div class="relative flex-1">
				<ModpackList :id="currentId" class="h-full overflow-y-auto absolute"/>
			</div>
		</div>
	</div>
</template>
>
