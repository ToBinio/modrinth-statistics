<script setup lang="ts">
useHead({
	htmlAttrs: {
		lang: "en",
	},
});

useSeoMeta({
	description: "The site for stats all about Modrinth.com",
	ogDescription: "The site for stats all about Modrinth.com",
});
</script>

<template>
	<NuxtLayout>
		<NuxtPage/>
	</NuxtLayout>
</template>
