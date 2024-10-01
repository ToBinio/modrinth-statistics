<script setup lang="ts">
const model = defineModel();

const { canClear = false } = defineProps<{
	title: string;
	options: string[];
	canClear?: boolean;
}>();
</script>

<template>
  <div id="main">
    <div id="title">{{ title }}</div>
    <select v-model="model">
      <option v-if="canClear">
      </option>
      <option v-for="option in options" :value="option">
        {{ option }}
      </option>
    </select>
  </div>
</template>

<style scoped>
#main{
  background: var(--surface-200);
  padding: 5px 10px;
  border-radius: 5px;

  #title {
    font-size: small;
  }

  select{
    font-size: medium;
    width: 100%;
  }
}
</style>