<script setup lang="ts">
import {projectTypeList, type ProjectTypes} from "~/utils/project";
import DropDownLink from "~/components/util/DropDownLink.vue";
import {firstLetterUpperCase} from "~/utils/text";

let urls = new Map<ProjectTypes, { title: string, url: string }[]>();

for (let type of projectTypeList) {
  const urlList = [
    {title: "Downloads", url: `/${type}/downloads`},
    {title: "Count", url: `/${type}/count`},
    {title: "Versions", url: `/${type}/versions`},
  ]

  urls.set(type, urlList)
}
</script>

<template>
  <DropDownLink v-for="type in projectTypeList" :urls="urls.get(type)!" :title="`${firstLetterUpperCase(type)}s`"/>
</template>

<style scoped>
</style>