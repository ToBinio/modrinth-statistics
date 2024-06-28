<script setup lang="ts">
import DropDownLink from "~/components/navigation/DropDownLink.vue";
import {projectTypeList, type ProjectTypes} from "~/utils/project";

let urls = new Map<ProjectTypes, { title: string, url: string }[]>();

for (let type of projectTypeList) {
  const urlList = [
    {title: "Downloads", url: `/${type}/downloads`},
    {title: "Versions", url: `/${type}/versions`},
  ]

  urls.set(type, urlList)
}

function firstLetterUpperCase(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
</script>

<template>
  <div id="links">
    <DropDownLink v-for="type in projectTypeList" :urls="urls.get(type)!" :title="`${firstLetterUpperCase(type)}s`"/>
  </div>
</template>

<style scoped>
#links {
  display: flex;
  gap: 50px;
}
</style>