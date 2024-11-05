<script setup lang="ts">
const model = defineModel();

const { canClear = false, options } = defineProps<{
	title: string;
	explanation: string;
	options: (string | { name: string; icon: string })[];
	canClear?: boolean;
}>();

const open = ref(false);

function onSelect(option: string | { name: string; icon: string }) {
	const name = getName(option);

	if (canClear && model.value === name) {
		model.value = undefined;
	} else {
		model.value = name;
	}
}

function getIconFromModel() : string {
  for (const option of options) {
    if (getName(option) === model.value) {
      return getIcon(option);
    }
  }

  return ""
}

function getIcon(option: string | { name: string; icon: string }) {
	if (typeof option === "string") {
		return "";
	}

	return option.icon;
}

function getName(option: string | { name: string; icon: string }) {
	if (typeof option === "string") {
		return option;
	}

	return option.name;
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
          <icon :name="getIconFromModel()" size="15"/>
          {{ model }}
        </button>
      </div>
      <div class="bg-neutral-900 z-10 relative flex flex-col max-h-48 overflow-scroll transition-all" :class="{'!max-h-0': !open}">
        <button class="text-left hover:bg-neutral-800 p-0.5 rounded flex items-center gap-1" :class="{'font-bold': getName(option) == model}" v-for="option in options" @click="onSelect(option)">
          <icon :name="getIcon(option)" size="15"/>
          {{ getName(option) }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>