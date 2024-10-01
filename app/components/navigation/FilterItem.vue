<script setup lang="ts">
const model = defineModel();

const { canClear = false } = defineProps<{
	options: string[];
	canClear?: boolean;
}>();
</script>

<template>
  <select v-model="model">
    <option v-if="canClear">
    </option>
    <option v-for="option in options" :value="option">
      {{ option }}
    </option>
  </select>
</template>

<style scoped>

</style>