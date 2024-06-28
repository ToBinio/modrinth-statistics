<script setup lang="ts">
import LinksContainer from "~/components/navigation/LinksContainer.vue";

async function onUpdateData() {
  await $fetch("/api/update")
}
</script>

<template>
  <div id="page">
    <div id="nav">
      <NuxtLink id="header" href="/">
        Modrinth Statistics
      </NuxtLink>
      <LinksContainer/>
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

    gap: 50px;

    overflow: auto;

    #header {
      font-weight: bold;
      font-size: xx-large;
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
