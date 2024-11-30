<script setup lang="ts">
useHead({
	title: "Modrinth Statistics",
});

const projectType = useFilterItem("projectType", "mod");
const stat = useFilterItem("stat", "count");

const versionGroup = useFilterItem("versionGroup", "major");

const time = useFilterItem("time", "current");

const exclusive = useFilterItem("exclusive", "yes");
const exclusiveBool = computed(() => exclusive.value === "yes");

const versionFrom = useFilterItem("versionFrom", undefined);
const versionTo = useFilterItem("versionTo", undefined);
const { to, from } = await useVersionRange(
	versionGroup,
	versionTo,
	versionFrom,
);

const gameVersions = await useGameVersions(versionGroup);
const defaultVersion = computed(() => {
	return gameVersions.value[gameVersions.value.length - 1] as string;
});
const version = useFilterItem("version", defaultVersion);

const { isGlobalStats, isProjectStats, isRevenueStats } =
	useTypeCategory(projectType);

const isGroupData = computed(() => {
	return (
		time.value === "current" && !isGlobalStats.value && !isRevenueStats.value
	);
});

const data = useStatData(isGlobalStats, isRevenueStats, time, {
	mode: versionGroup,
	exclusive: exclusiveBool,
	type: projectType,
	stat: stat,
	versionTo: versionTo,
	versionFrom: versionFrom,
	version: version,
});

const explanation = computed(() => {
	return useExplanations(stat.value);
});

const sideBarOpen = ref(false);
</script>

<template>
  <div class="flex flex-1">
    <SideBar v-model:open="sideBarOpen">
      <div class="flex-1 flex flex-col gap-6 px-2 pt-8">
        <FilterItem :should-display="true" v-model="projectType"
                    :options="['mod', 'plugin', 'datapack', 'shader', 'resourcepack', 'modpack', 'projects', 'versions', 'authors', 'files', 'revenue']"
                    title="Type" explanation=""/>

        <FilterItem :should-display="isProjectStats" v-model="stat" :options="['count', 'downloads', 'versions']"
                    title="Stat" explanation=""/>
        <FilterItem :should-display="isProjectStats" v-model="versionGroup" :options="['major', 'minor', 'all']"
                    title="Version Group"
                    explanation="What type of Minecraft versions should be displayed"/>
        <FilterItem :should-display="isProjectStats" v-model="exclusive" :options="['yes', 'no']" title="Exclusive"
                    explanation="Only show Versions made for a single launcher"/>
        <FilterItem :should-display="isProjectStats" v-model="time" :options="['current', 'all']" title="Time"
                    explanation=""/>

        <FilterItem :should-display="isProjectStats" v-if="time == 'current'" v-model="versionFrom" :can-clear="true"
                    :options="from"
                    title="Version From" explanation="Whats the first version that should be displayed"/>
        <FilterItem :should-display="isProjectStats" v-if="time == 'current'" v-model="versionTo" :can-clear="true"
                    :options="to" title="Version To"
                    explanation="Whats the last version that should be displayed"/>

        <FilterItem :should-display="isProjectStats" v-if="time != 'current'" v-model="version" :options="gameVersions"
                    title="Version"
                    explanation=""/>
      </div>
    </SideBar>

    <div class="flex pl-0 w-full transition-all md:pl-48" :class="{'!pl-0': !sideBarOpen}">
      <ChartBarChart v-if="isGroupData" :data="data" :type="projectType as string"/>
      <ChartLineChart v-else :data="data" :type="projectType as string"/>
      <Explanation v-if="isProjectStats" :explanation="explanation"/>
    </div>
  </div>
</template>