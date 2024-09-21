<script setup lang="ts">
import Charts from "~/components/Charts.vue";

const route = useRoute();
useHead({
	title: `Number of downloads of ${route.params.type}`,
});

const explanation = `
<h4>Number of Downloads per Specific Loader/Game-Version</h4>
<br/>
If a version supports multiple loaders or game-versions, the downloads will be divided equally among each supported loader/game-version.
<br/>
<br/>
This may exaggerate widely supported but less commonly used loaders or versions, such as Quilt.
`;
</script>

<template>
  <Charts stat="downloads" :type="route.params.type as string"
          :explanation="explanation"/>
</template>