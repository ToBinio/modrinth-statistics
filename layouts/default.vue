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
  <div id="page">
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
      <DevOnly>
        <button @click="onUpdateData">
          update Data
        </button>
      </DevOnly>
      <NuxtLink id="github" to="https://github.com/ToBinio/modrinth-statistics" target="_blank">
        <Icon name="mdi:github" size="40"/>
      </NuxtLink>
    </div>
    <div id="main">
      <slot/>
    </div>
  </div>
</template>

<style scoped>
#page {
  min-height: 100vh;

  flex: 1;

  display: flex;
  flex-direction: column;

  #nav {
    padding: 10px;
    margin: 10px;

    border-bottom: 2px solid var(--surface-200);

    display: flex;

    justify-content: space-between;
    align-items: center;

    gap: 10px;

    overflow: scroll;

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

    #github {
      transition: 0.1s scale ease-in-out;

      &:hover {
        scale: 1.05;
      }
    }

    button {
      color: black;
    }

    a {
      text-decoration: none;
      transition: 0.2s color ease-out;

      &:hover {
        color: var(--primary-600);
      }

      &.router-link-active {
        color: transparent;
        background: linear-gradient(10deg, var(--primary-100) 30%, var(--primary-600) 100%);
        background-clip: text;
      }
    }
  }

  #main {
    flex: 1;
    position: relative;

    display: flex;
    flex-direction: column;
  }
}
</style>
