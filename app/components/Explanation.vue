<script setup lang="ts">
	defineProps<{ explanation: string | undefined }>();
</script>

<template>
	<div id="tooltip">
		<Icon name="akar-icons:question" size="25"/>
		<div id="explanation" v-html="explanation"></div>
	</div>
</template>

<style scoped>
	@reference "~/assets/css/main.css";

	#tooltip {
		position: absolute;

		top: 0;
		right: 10px;

		#explanation {
			position: absolute;
			right: 0;
			scale: 1;

			@apply bg-zinc-800 transition-all;
			translate: 0 0;

			padding: 10px;
			border-radius: 10px;

			width: 400px;
			max-width: 90vw;
		}

		&:not(:hover) {
			#explanation {
				scale: 0;
				translate: 50% -50%;
			}
		}
	}
</style>

<style>
	#explanation {
		h4 {
			font-weight: bold;
		}
	}
</style>
