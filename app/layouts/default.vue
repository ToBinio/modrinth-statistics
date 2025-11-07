<script setup lang="ts">
</script>

<template>
	<div id="page">
		<div id="nav" class="border-b-2 border-b-zinc-800">
			<div class="compact">
				<ModrinthLink/>
				<div id="icons">
					<NuxtLink
						id="github"
						to="https://github.com/ToBinio/modrinth-statistics"
						target="_blank"
						aria-label="Github of this Project"
					>
						<Icon name="akar-icons:github-fill" size="40"/>
					</NuxtLink>
				</div>
			</div>
			<ModrinthLink class="big"/>
			<div class="flex flex-col gap-2 sm:flex-row sm:gap-10 md:gap-20">
				<NuxtLink
					href="/charts"
					active-class="active-link !to-cyan-500"
					class="group font-bold flex items-center gap-2 text-3xl text-transparent! from-white to-white bg-linear-to-br bg-clip-text hover:from-cyan-200! hover:to-cyan-600!"
				>
					<Icon
						name="akar-icons:statistic-up"
						size="35"
						class="bg-linear-to-br from-white group-hover:from-cyan-200 group-hover:to-cyan-600 group-[.active-link]:to-cyan-500!"
					/>
					Charts
				</NuxtLink>
				<NuxtLink
					href="/reverseSearch"
					active-class="active-link !to-cyan-500"
					class="group font-bold flex items-center gap-2 text-3xl text-transparent! from-white to-white bg-linear-to-br bg-clip-text hover:from-cyan-200! hover:to-cyan-600!"
				>
					<Icon
						name="akar-icons:search"
						size="35"
						class="bg-linear-to-br from-white group-hover:from-cyan-200 group-hover:to-cyan-600 group-[.active-link]:to-cyan-500!"
					/>
					ModSearch
				</NuxtLink>
			</div>
			<div class="big" id="icons">
				<NuxtLink
					id="github"
					to="https://github.com/ToBinio/modrinth-statistics"
					target="_blank"
					aria-label="Github of this Project"
				>
					<Icon name="akar-icons:github-fill" size="40"/>
				</NuxtLink>
			</div>
		</div>
		<div id="main">
			<slot/>
		</div>
	</div>
</template>

<style scoped>
	@media only screen and (max-width: 700px) {
		#nav {
			.compact {
				display: flex !important;
				gap: 20px;
			}

			.big {
				display: none !important;
			}

			gap: 20px !important;
			flex-direction: column;
			#icons {
				gap: 10px !important;
				display: flex;
				align-items: center;
			}
		}
	}

	#page {
		min-height: 100vh;

		flex: 1;

		display: flex;
		flex-direction: column;

		#nav {
			.compact {
				display: none;
			}

			z-index: 10;

			padding: 10px;
			margin: 10px;

			display: flex;

			justify-content: space-between;
			align-items: center;

			gap: 50px;

			#header {
				font-weight: bold;
				font-size: xx-large;
			}

			#icons {
				display: flex;
				gap: 25px;

				#github {
					display: block;
					transition: 0.1s scale ease-in-out;

					&:hover {
						scale: 1.05;
					}
				}
			}

			button {
				color: black;
			}
		}

		#main {
			flex: 1;
			position: relative;

			display: flex;
			flex-direction: column;
		}
	}
</style>
