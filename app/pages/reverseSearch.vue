<script setup lang="ts">
	const text = ref("");

	const result = useFetch("/api/reverseSearch", {
		params: {
			id: text,
		},
	});
</script>
<template>
	<input v-model="text" type="text" placeholder="Search...">
	<div v-if="result.data">
		<p>Result: {{ result.data }}</p>
	</div>
</template>
>
