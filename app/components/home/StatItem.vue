<script setup lang="ts">
const props = defineProps<{
  icon: string;
  name: string;
  data: number | undefined;
}>();

const displayValue = ref(0);

const startCountUp = () => {
  const duration = 1000 + Math.random() * 1000;
  const startTime = performance.now();

  function easeOutCubic(x: number): number {
    return 1 - Math.pow(1 - x, 7);

  }

  function animate(currentTime: number) {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    displayValue.value = Math.floor(easeOutCubic(progress) * (props.data ?? 0));

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
};

onMounted(() => {
  startCountUp()
})

</script>

<template>
  <div class="flex justify-center gap-2.5">
    <div class="relative">
      <div class="blur-2xl absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4">
        <Icon :name="icon" size="120" class="from-cyan-600 to-cyan-900 bg-gradient-to-tl"/>
      </div>
      <Icon :name="icon" size="150" class="from-cyan-200 to-cyan-600 bg-gradient-to-br"/>
    </div>
    <div class="flex flex-col justify-center">
      <div class="text-5xl">
        {{ displayValue?.toLocaleString() }}
        <div class="h-0 overflow-hidden px-2">
          {{ data?.toLocaleString() }}
        </div>
      </div>
      <div>
        {{ name }}
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>