<script setup lang="ts">
const sidebarVisible = defineModel<boolean>("open");

onMounted(() => {
	const isMediumScreen = useMediaQuery("(min-width: 768px)");

	if (isMediumScreen.value) {
		sidebarVisible.value = true;
	}
});
</script>

<template>
  <button class="absolute z-20 px-2 w-48 flex justify-end transition-all" @click="sidebarVisible = !sidebarVisible" :class="{'!w-10': !sidebarVisible}">
    <icon name="ic:round-menu" size="24"/>
  </button>
  <div class="w-48 flex h-full bg-zinc-900 z-10 absolute overflow-scroll transition-all" :class="{'-translate-x-48': !sidebarVisible}">
    <slot/>
    <div class="border border-zinc-800 w-0.5 mb-2"></div>
  </div>
</template>

<style scoped>

</style>