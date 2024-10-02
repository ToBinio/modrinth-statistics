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
    <div id="links">
      <FilterItem v-model="projectType" :options="['mod', 'plugin', 'datapack', 'shader', 'resourcepack', 'modpack']" title="Type" explanation=""/>
      <FilterItem v-model="stat" :options="['count', 'downloads', 'versions']" title="Stat" explanation=""/>
      <FilterItem v-model="versionGroup" :options="['major', 'minor', 'all']" title="Version Group" explanation="What type of Minecraft versions should be displayed"/>
      <FilterItem v-model="versionFrom" :can-clear="true" :options="from" title="Version From" explanation="Whats the first version that should be displayed"/>
      <FilterItem v-model="versionTo" :can-clear="true" :options="to" title="Version To" explanation="Whats the last version that should be displayed"/>
      <FilterItem v-model="exclusive" :options="['yes', 'no']" title="Exclusive" explanation="Only show Versions made for a single launcher"/>
    </div>
  </Teleport>
  <Charts :data="data" :type="projectType as string"/>
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