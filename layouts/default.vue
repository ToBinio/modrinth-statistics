<script setup lang="ts">
import DropDownLink from "~/components/navigation/DropDownLink.vue";

async function onUpdateData() {
  await $fetch("/api/update")
}

const downloadUrls = [
  {title: "Major Versions", url: "/downloads/major"},
  {title: "Minor Versions", url: "/downloads/minor"},
  {title: "All Versions", url: "/downloads/all"},
]

const countUrls = [
  {title: "Major Versions", url: "/counts/major"},
  {title: "Minor Versions", url: "/counts/minor"},
  {title: "All Versions", url: "/counts/all"},
]

</script>

<template>
  <div id="nav">
    <NuxtLink id="header" href="/">
      Modrinth Statistics
    </NuxtLink>
    <div>
      <DropDownLink :urls="downloadUrls" title="Downloads"/>
      <DropDownLink :urls="countUrls" title="Counts"/>
    </div>
    <button @click="onUpdateData">
      update Data
    </button>
  </div>
  <div id="main">
    <slot/>
  </div>
</template>

<style scoped>
#nav {
  padding: 10px;
  margin: 10px;

  border-bottom: 2px solid var(--surface-200);

  display: flex;

  gap: 10%;
  align-items: center;

  #header {
    font-weight: bold;
    font-size: xx-large;
  }

  button {
    color: black;
  }

  a {
    text-decoration: none;
    transition: 0.2s color ease-out;

    &.router-link-active {
      color: var(--primary-100);
    }
  }
}

#main {
  flex: 1;
}
</style>
