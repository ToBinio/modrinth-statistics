<script setup lang="ts">
import Charts from "~/components/Charts.vue";

const route = useRoute();
useHead({
	title: `Number of mods of ${route.params.type}`,
});

const explanation = `
<h4>Number of Mods Supporting Each Loader/Game-Version</h4>
<br/>
Each mod will only be counted once. This means if a mod has 10 versions supporting a single versions in will still only be counted once.
`;
</script>

<template>
  <Charts stat="count" :type="route.params.type as string"
          :explanation="explanation"/>
</template>