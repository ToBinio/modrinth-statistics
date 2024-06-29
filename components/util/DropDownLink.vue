<script setup lang="ts">

const props = defineProps<{ urls: { title: string, url: string }[], title: string }>();

let currentUrl = ref(props.urls[0].url)

const route = useRoute();

for (let url of props.urls) {
  if (url.url == route.path) {
    currentUrl.value = url.url
  }
}

function onClick(event: Event) {
  const tagName = (event.target! as HTMLElement).tagName;

  if (tagName == "OPTION") {
    navigateTo(currentUrl.value)
  }
}

watch(currentUrl, (url) => {
  navigateTo(url)
})

</script>

<template>
  <div id="dropdown">
    <NuxtLink class="header" :to="currentUrl">{{ title }}</NuxtLink>
    <select v-model="currentUrl" @click="onClick">
      <option v-for="route in urls" :key="route.url" :value="route.url">
        {{ route.title }}
      </option>
    </select>
  </div>
</template>

<style scoped>
#dropdown {
  display: flex;
  flex-direction: column;

  .header {
    transition: 0.2s color ease-out;
    font-size: x-large;
  }

  a {
    text-decoration: none;
    transition: 0.2s color ease-out;

    &:hover {
      color: var(--primary-600);
    }

    &.router-link-active {
      color: var(--primary-100);
    }
  }
}
</style>