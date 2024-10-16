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

const isGlobalStats = computed(() => {
	return ["projects", "versions", "authors", "files"].includes(
		projectType.value,
	);
});

const url = computed(() => {
	if (isGlobalStats.value) {
		return "/api/stats/time/global";
	}

	return time.value === "current"
		? "/api/stats/projects"
		: "/api/stats/time/projects";
});

const { data } = useFetch<StatExport>(url, {
	query: {
		mode: versionGroup,
		exclusive: exclusiveBool,
		type: projectType,
		stat: stat,
		versionTo: versionTo,
		versionFrom: versionFrom,
		version: version,
	},
});

const explanation = computed(() => {
	return useExplanations(stat.value);
});
</script>

<template>
  <ClientOnly>
    <Teleport to="#navBody">
      <div id="links">
        <FilterItem v-model="projectType" :options="['mod', 'plugin', 'datapack', 'shader', 'resourcepack', 'modpack', 'projects', 'versions', 'authors', 'files']" title="Type" explanation=""/>
        <If :state="!isGlobalStats">
          <FilterItem v-model="stat" :options="['count', 'downloads', 'versions']" title="Stat" explanation=""/>
          <FilterItem v-model="versionGroup" :options="['major', 'minor', 'all']" title="Version Group" explanation="What type of Minecraft versions should be displayed"/>
          <FilterItem v-model="exclusive" :options="['yes', 'no']" title="Exclusive" explanation="Only show Versions made for a single launcher"/>
          <FilterItem v-model="time" :options="['current', 'all']" title="Time" explanation=""/>

          <FilterItem v-if="time == 'current'" v-model="versionFrom" :can-clear="true" :options="from" title="Version From" explanation="Whats the first version that should be displayed"/>
          <FilterItem v-if="time == 'current'" v-model="versionTo" :can-clear="true" :options="to" title="Version To" explanation="Whats the last version that should be displayed"/>

          <FilterItem v-if="time != 'current'" v-model="version" :options="gameVersions" title="Version" explanation=""/>
        </If>
      </div>
    </Teleport>
  </ClientOnly>

  <BarChart v-if="time == 'current' && !isGlobalStats" :data="data" :type="projectType as string"/>
  <LineChart v-else :data="data" :type="projectType as string"/>

  <div id="tooltip">
    <Icon name="ph:question" size="25" style="color: var(--white)"/>
    <div id="explanation" v-html="explanation">
    </div>
  </div>
</template>

<style scoped>
#links{
  display: flex;
  gap: 20px;
}

#tooltip {
  position: absolute;

  top: 0;
  right: 10px;

  &:not(:hover) {
    #explanation {
      display: none;
    }
  }

  #explanation {
    position: absolute;
    right: 0;

    background-color: var(--surface-200);
    padding: 10px;
    border-radius: 10px;

    width: 400px;
    max-width: 90vw;
  }
}
</style>

<style>
#explanation {
  h4 {
    margin: 0;
  }
}
</style>