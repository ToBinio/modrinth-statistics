<script setup lang="ts">
const model = defineModel();

const { canClear = false, options } = defineProps<{
	title: string;
	explanation: string;
	options: string[];
	canClear?: boolean;
}>();

const open = ref(false);

function onSelect(option: string) {
	if (canClear && model.value === option) {
		model.value = undefined;
	} else {
		model.value = option;
	}
}
</script>

<template>
  <div class="flex flex-col">
    <button @click="open = !open" class="transition flex justify-between items-center" >
      <abbr class="no-underline text-sm text-neutral-400" :title="explanation" id="title">{{ title }}</abbr>
      <icon name="ep:arrow-down-bold" :class="{'rotate-180': open}" size="15"/>
    </button>
    <div class="min-h-4">
      <div>
        <button class="absolute z-0 font-bold content-between justify-between" :class="{'hover:text-neutral-400': canClear}" @click="model = undefined" :disabled="!canClear">
          {{ model }}
        </button>
      </div>
      <div class="bg-neutral-900 z-10 relative flex flex-col max-h-48 overflow-scroll transition-all" :class="{'!max-h-0': !open}">
        <button class="text-left hover:bg-neutral-800 p-0.5 rounded" :class="{'font-bold': option == model}" v-for="option in options" @click="onSelect(option)">
          {{ option }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>