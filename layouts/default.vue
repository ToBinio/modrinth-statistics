<script setup lang="ts">
async function onUpdateData() {
  await $fetch("/api/update")
}

const urls = [
  {title: "Major Versions", url: "/downloads/major"},
  {title: "Minor Versions", url: "/downloads/minor"},
  {title: "All Versions", url: "/downloads/all"},
]

let currentUrl = ref(urls[0].url)

const route = useRoute();

for (let url of urls) {
  if (url.url == route.path) {
    currentUrl.value = url.url
  }
}

watch(currentUrl, (url) => {
  navigateTo(url)
})
</script>

<template>
  <div id="nav">
    <NuxtLink id="header" href="/">
      Modrinth Statistics
    </NuxtLink>
    <div>
      <div id="downloads">
        <NuxtLink class="header" :to="currentUrl">Downloads</NuxtLink>
        <select v-model="currentUrl">
          <option v-for="download in urls" :key="download.url" :value="download.url">
            {{ download.title }}
          </option>
        </select>
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

  button {
    color: black;
  }

  #downloads {
    display: flex;
    flex-direction: column;

    .header {
      transition: 0.2s color ease-out;
      font-size: x-large;
    }

    select {
      background-color: transparent;
      border: none;
      border-radius: 7px;

      padding: 0 0 5px;
    }
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
