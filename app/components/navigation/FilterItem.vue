<script setup lang="ts">
const model = defineModel();

const { canClear = false } = defineProps<{
	title: string;
	explanation: string;
	options: string[];
	canClear?: boolean;
}>();
</script>

<template>
  <div id="main">
    <abbr :title="explanation" id="title">{{ title }}</abbr>
    <select v-model="model">
      <option v-if="canClear" :value="undefined">
      </option>
      <option v-for="option in options" :value="option">
        {{ option }}
      </option>
    </select>
  </div>
</template>

<style scoped>
#main{
  min-width: max-content;
  background: var(--surface-200);
  padding: 5px 10px;
  border-radius: 5px;

  #title {
    font-size: small;
    text-decoration: none;
  }

  select{
    font-size: medium;
    width: 100%;
  }
}
</style>