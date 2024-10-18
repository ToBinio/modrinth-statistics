<script setup lang="ts">
const model = defineModel();

const { canClear = false, options } = defineProps<{
	title: string;
	explanation: string;
	options: string[];
	canClear?: boolean;
}>();

const open = ref(false);
</script>

<template>
  <div class="flex flex-col">
    <button @click="open = !open" class="transition flex justify-between items-center" >
      <abbr class="no-underline text-sm text-neutral-400" :title="explanation" id="title">{{ title }}</abbr>
      <icon name="ep:arrow-down-bold" :class="{'rotate-180': open}" size="15"/>
    </button>
    <div class="min-h-4">
      <div class="absolute z-0">
        {{ model }}
      </div>
      <div class="bg-black z-10 relative flex flex-col max-h-48 overflow-scroll transition-all" :class="{'max-h-0': !open}">
        <button class="text-left" v-for="option in options" @click="model = option">
          {{ option }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>