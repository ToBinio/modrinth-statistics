<script setup lang="ts">
import { useFilterItem } from "~/composables/useFilterItem";
import FilterItem from "~/components/navigation/FilterItem.vue";
import { useVersionRange } from "#imports";

const projectType = useFilterItem("projectType", "mod");
const stat = useFilterItem("stat", "count");

const versionGroup = useFilterItem("versionGroup", "major");

const versionFrom = useFilterItem("versionFrom", undefined);
const versionTo = useFilterItem("versionFrom", undefined);
const { to, from } = useVersionRange(versionGroup, versionTo, versionFrom);

const exclusive = useFilterItem("exclusive", "yes");
const exclusiveBool = computed(() => exclusive.value === "yes");

const { data } = useFetch<StatExport>("/api/stats", {
	query: {
		mode: versionGroup,
		exclusive: exclusiveBool,
		type: projectType,
		stat: stat,
		versionTo: versionTo,
		versionFrom: versionFrom,
	},
});
</script>

<template>
  <Teleport to="#navBody">
    <FilterItem v-model="projectType" :options="['mod', 'plugin', 'datapack', 'shader', 'resourcepack', 'modpack']"/>
    <FilterItem v-model="stat" :options="['count', 'downloads', 'versions']"/>
    <FilterItem v-model="versionGroup" :options="['major', 'minor', 'all']"/>
    <FilterItem v-model="versionFrom" :can-clear="true" :options="from"/>
    <FilterItem v-model="versionTo" :can-clear="true" :options="to"/>
    <FilterItem v-model="exclusive" :options="['yes', 'no']"/>
  </Teleport>
  <Charts :data="data" :type="projectType as string"
          explanation=""/>
</template>

<style scoped>

</style>