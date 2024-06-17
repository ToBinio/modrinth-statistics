<script setup lang="ts">
async function onUpdateData() {
  await $fetch("/api/update")
}
</script>

<template>
  <div id="nav">
    <NuxtLink id="header" href="/">
      Modrinth Statistics
    </NuxtLink>
    <button @click="onUpdateData">
      update Data
    </button>
    <div>
      <NuxtLink href="/downloads">
        All Downloads
      </NuxtLink>
      <NuxtLink href="/minorVersionDownloads">
        minor Downloads
      </NuxtLink>
      <NuxtLink href="/majorVersionDownloads">
        major Downloads
      </NuxtLink>
    </div>
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
    font-size: xx-large;
  }

  button {
    color: black;
  }

  a {
    font-size: large;

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
