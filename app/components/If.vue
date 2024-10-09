<script setup lang="ts">
defineProps<{ state: boolean }>();
</script>

<template>
  <slot v-if="state"></slot>
</template>

<style scoped>

</style>