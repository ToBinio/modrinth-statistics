<script setup lang="ts">
import DropDownLink from "~/components/navigation/DropDownLink.vue";
import {projectTypeList, type ProjectTypes} from "~/utils/project";

let urls = new Map<ProjectTypes, {
  download: { title: string, url: string }[],
  count: { title: string, url: string }[]
}>();

for (let type of projectTypeList) {
  const downloads = [
    {title: "Major Versions", url: `/${type}/downloads/major`},
    {title: "Minor Versions", url: `/${type}/downloads/minor`},
    {title: "All Versions", url: `/${type}/downloads/all`},
  ]

  const counts = [
    {title: "Major Versions", url: `/${type}/counts/major`},
    {title: "Minor Versions", url: `/${type}/counts/minor`},
    {title: "All Versions", url: `/${type}/counts/all`},
  ]

  urls.set(type, {download: downloads, count: counts})
}
</script>

<template>
  <div id="links">
    <div class="groups" v-for="type in projectTypeList">
      <DropDownLink :urls="urls.get(type)!.download" :title="`${type} Downloads`"/>
      <DropDownLink :urls="urls.get(type)!.count" :title="`${type} Versions`"/>
    </div>
  </div>
</template>

<style scoped>
#links {
  display: flex;
  gap: 50px;

  .groups {
    display: flex;
    gap: 20px;
  }
}
</style>