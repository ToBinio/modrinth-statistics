<script setup lang="ts">
import Charts from "~/components/Charts.vue";

const route = useRoute();
useHead({
  title: `Number of versions of ${route.params.type}`
})

const explanation = `
<h4>Number of versions that support a specif loader/game-version.</h4>
If a version supports multiple loaders or game-versions
<br/>
the version will be counted every loader/game-version.
`
</script>

<template>
  <Charts :mode="route.params.mode as string" stat="count" :type="route.params.type as string" url="/api/counts"
          :explanation="explanation"/>
</template>