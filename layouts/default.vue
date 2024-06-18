<script setup lang="ts">
import DropDownLink from "~/components/navigation/DropDownLink.vue";

async function onUpdateData() {
  await $fetch("/api/update")
}

const modDownloadUrls = [
  {title: "Major Versions", url: "/mod/downloads/major"},
  {title: "Minor Versions", url: "/mod/downloads/minor"},
  {title: "All Versions", url: "/mod/downloads/all"},
]

const modCountUrls = [
  {title: "Major Versions", url: "/mod/counts/major"},
  {title: "Minor Versions", url: "/mod/counts/minor"},
  {title: "All Versions", url: "/mod/counts/all"},
]

const modpackDownloadUrls = [
  {title: "Major Versions", url: "/modpack/downloads/major"},
  {title: "Minor Versions", url: "/modpack/downloads/minor"},
  {title: "All Versions", url: "/modpack/downloads/all"},
]

const modpackCountUrls = [
  {title: "Major Versions", url: "/modpack/counts/major"},
  {title: "Minor Versions", url: "/modpack/counts/minor"},
  {title: "All Versions", url: "/modpack/counts/all"},
]

</script>

<template>
  <div id="nav">
    <NuxtLink id="header" href="/">
      Modrinth Statistics
    </NuxtLink>
    <div id="links">
      <div class="groups">
        <DropDownLink :urls="modDownloadUrls" title="Mod Downloads"/>
        <DropDownLink :urls="modCountUrls" title="Mod Counts"/>
      </div>
      <div class="groups">
        <DropDownLink :urls="modpackDownloadUrls" title="Modpack Downloads"/>
        <DropDownLink :urls="modpackCountUrls" title="Modpack Counts"/>
      </div>
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

  #links {
    display: flex;
    gap: 50px;

    .groups {
      display: flex;
      gap: 20px;
    }
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
  position: relative;
}
</style>
