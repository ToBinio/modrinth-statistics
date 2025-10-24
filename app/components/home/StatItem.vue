<script setup lang="ts">
	const props = defineProps<{
		icon: string;
		name: string;
		data: number | undefined;
	}>();

	const displayValue = ref(0);

	const startCountUp = () => {
		const duration = 3000 + Math.random() * 2000;
		const startTime = performance.now();

		function easeOutCubic(x: number): number {
			return 1 - (1 - x) ** 7;
		}

		function animate(currentTime: number) {
			const elapsedTime = currentTime - startTime;
			const progress = Math.min(elapsedTime / duration, 1);
			displayValue.value = Math.floor(
				easeOutCubic(progress) * (props.data ?? 0),
			);

			if (progress < 1) {
				requestAnimationFrame(animate);
			}
		}

		requestAnimationFrame(animate);
	};

	onMounted(() => {
		startCountUp();
	});
</script>

<template>
	<div class="flex justify-center gap-2.5">
		<div class="relative flex-1 flex justify-end">
			<div class="blur-2xl absolute top-1/2 -translate-y-1/2">
				<Icon
					:name="icon"
					size="120"
					class="from-cyan-400 to-cyan-600 bg-gradient-to-tl"
				/>
			</div>
			<NuxtLink class="z-10" :to="'/charts?project_type=' + name.toLowerCase()">
				<Icon
					:name="icon"
					size="150"
					class="hover:scale-105 transition ease-in-out from-cyan-200 to-cyan-600 bg-gradient-to-br"
				/>
			</NuxtLink>
		</div>
		<div class="flex flex-col justify-center flex-1">
			<div
				:aria-label="`The number of ${name} on modrinth right now is ${displayValue?.toLocaleString()}`"
				class="text-5xl"
			>
				{{ displayValue?.toLocaleString() }}
			</div>
			<div>{{ name }}</div>
		</div>
	</div>
</template>

<style scoped>
</style>
