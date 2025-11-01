<script setup lang="ts">
	import ModpackList from "~/components/search/ModpackList.vue";

	const text = ref("P7dR8mSH");
	const { data: count } = useFetch("/api/reverseSearch/count", {
		params: {
			id: text,
		},
	});
</script>
<template>
	<div class="flex flex-1 flex-col">
		<div class="flex flex-col gap-5 items-center mt-4">
			<span class="text-3xl">Find all Modpacks which include the Project</span>
			<input
				class="border border-gray-300 rounded-md px-2 py-1"
				v-model="text"
				type="text"
				placeholder="Project ID..."
			>
		</div>
		<div class="flex flex-col flex-1 mx-4 gap-4">
			<div class="text-2xl">Modpacks: {{ count?.count }}</div>
			<div class="relative flex-1">
				<ModpackList :id="text" class="h-full overflow-y-auto absolute"/>
			</div>
		</div>
	</div>
</template>
>
