<script setup lang="ts">
import { computed } from "vue";
import FilterItem from "~/components/navigation/FilterItem.vue";
import { useExplanations } from "~/composables/useExplanations";
import { useFilterItem } from "~/composables/useFilterItem";
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

const explanation = computed(() => {
	return useExplanations(stat.value);
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
  <Charts :data="data" :type="projectType as string"/>
  <div id="tooltip">
    <Icon name="ph:question" size="25" style="color: var(--white)"/>
    <div id="explanation" v-html="explanation">
    </div>
  </div>
</template>

<style scoped>
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