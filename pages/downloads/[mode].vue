<script setup lang="ts">
import Charts from "~/components/Charts.vue";

const route = useRoute();
const explanation = `
<h4>Number of downloads for a specif loader/game-version.</h4>
If a version supports multiple loaders or game-versions
<br/>
the downloads will be divided equally between each loader/game-version.
`
</script>

<template>
  <Charts :mode="route.params.mode as string" url="/api/downloads" :explanation="explanation"/>
</template>