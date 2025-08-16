<script setup lang="ts">
const model = defineModel();

const { canClear = false, options } = defineProps<{
	shouldDisplay: boolean;
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
  <Transition>
    <div v-if="shouldDisplay" id="main" class="flex flex-col transition-all">
      <button @click="open = !open" class="transition flex justify-between items-center">
        <abbr class="no-underline text-sm text-neutral-400" :title="explanation" id="title">{{ title }}</abbr>
        <icon name="akar-icons:chevron-up" :class="{'rotate-180': !open}" size="15"/>
      </button>
      <div class="min-h-4 relative">
        <div>
          <button class="absolute z-0 font-bold content-between justify-between"
                  :class="{'hover:text-neutral-400': canClear}" @click="model = undefined" :disabled="!canClear">
            {{ model }}
          </button>
        </div>
        <div class="bg-zinc-900 z-10 relative flex flex-col max-h-48 overflow-scroll transition-all"
             :class="{'!max-h-0': !open}">
          <button class="text-left hover:bg-zinc-800 p-0.5 rounded" :class="{'font-bold': option == model}"
                  v-for="option in options" @click="onSelect(option)">
            {{ option }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: 0.4s ease;
}

.v-enter-from,
.v-leave-to {
  transform: translateX(-120%);
  opacity: 0;
}
</style>