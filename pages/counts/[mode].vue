<script setup lang="ts">
import Charts from "~/components/Charts.vue";
const route = useRoute();
</script>

<template>
  <Charts :mode="route.params.mode as string" url="/api/counts"/>
</template>