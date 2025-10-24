<script setup lang="ts">
useHead({
	title: "Modrinth Statistics",
});

useTracking();

const { data } = useFetch("/api/stats/global");
</script>

<template>
	<div class="dotted-background flex-1 flex flex-col justify-evenly gap-11">
		<h1
			class="text-center text-6xl font-semibold flex flex-col justify-center items-center"
		>
			The place for stats all about
			<div class="transition hover:scale-110">
				<div class="blur-3xl absolute">
					<NuxtLink
						to="https://modrinth.com"
						id="modrinth"
						target="_blank"
						class="text-8xl opacity-80 text-transparent! bg-clip-text from-cyan-400 to-cyan-600 bg-gradient-to-br"
					>
						Modrinth
					</NuxtLink>
				</div>
				<NuxtLink
					to="https://modrinth.com"
					id="modrinth"
					target="_blank"
					class="text-8xl text-transparent! bg-clip-text from-cyan-200 to-cyan-600 bg-gradient-to-br"
				>
					Modrinth
				</NuxtLink>
			</div>
			<div class="text-xl text-neutral-500">(unofficial)</div>
		</h1>
		<div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-y-16">
			<HomeStatItem
				name="Projects"
				:data="data?.projects"
				icon="akar-icons:game-controller"
			/>
			<HomeStatItem
				name="Versions"
				:data="data?.versions"
				icon="akar-icons:attach"
			/>
			<HomeStatItem name="Files" :data="data?.files" icon="akar-icons:file"/>
			<HomeStatItem
				name="Authors"
				:data="data?.authors"
				icon="akar-icons:person"
			/>
		</div>
	</div>
</template>

<style scoped>
.dotted-background {
	background-image:
		radial-gradient(#18181b 1px, transparent 1px),
		radial-gradient(#18181b 2px, transparent 2px),
		linear-gradient(to bottom, #18181b, #030712);
	background-size:
		10px 10px,
		30px 30px,
		cover;
}
</style>
