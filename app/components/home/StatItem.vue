<script setup lang="ts">
defineProps<{
	icon: string;
	name: string;
	data: number | undefined;
}>();
</script>

<template>
  <div class="flex justify-center gap-2.5" >
    <Icon :name="icon" size="150" class="from-cyan-200 to-cyan-600 bg-gradient-to-br"/>
    <div class="flex flex-col justify-center">
      <div class="text-5xl">
        {{ data?.toLocaleString() }}
      </div>
      <div>
        {{ name }}
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>