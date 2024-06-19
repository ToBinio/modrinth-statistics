<script setup lang="ts">
import Charts from "~/components/Charts.vue";

const route = useRoute();
useHead({
  title: `Number of versions of ${route.params.type}`
})

const explanation = `
<h4>Number of Versions Supporting Each Loader/Game-Version</h4>
<br/>
Each version will be counted separately for every loader or game-version it supports. If a version supports multiple loaders or game-versions, it will be counted once for each supported loader/game-version.
`
</script>

<template>
  <Charts :mode="route.params.mode as string" stat="count" :type="route.params.type as string" url="/api/counts"
          :explanation="explanation"/>
</template>