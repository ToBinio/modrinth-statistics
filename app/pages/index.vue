<script setup lang="ts">
useHead({
	title: "Modrinth Statistics",
});

const { data } = useFetch("/api/stats/global");
</script>

<template>
  <div id="page" class="from-neutral-900 to-neutral-950 bg-gradient-to-b">
    <div id="header">
      The place for stats all about
      <NuxtLink to="https://modrinth.com" id="modrinth" target="_blank" class="text-8xl text-transparent bg-clip-text from-cyan-200 to-cyan-600 bg-gradient-to-br transition hover:scale-110">Modrinth</NuxtLink>
      <div class="text-xl text-neutral-500">(unofficial)</div>
    </div>
    <div id="values">
      <HomeStatItem name="Projects" :data="data?.projects" icon="akar-icons:game-controller"/>
      <HomeStatItem name="Versions" :data="data?.versions" icon="akar-icons:attach"/>
      <HomeStatItem name="Files" :data="data?.files" icon="akar-icons:file"/>
      <HomeStatItem name="Authors" :data="data?.authors" icon="akar-icons:person"/>
    </div>
  </div>
</template>

<style scoped>
#page {
  flex: 1;

  display: flex;
  flex-direction: column;
  justify-content: space-evenly;

  gap: 50px;

  #header {
    text-align: center;
    font-size: 4rem;
    font-weight: bold;

    display: flex;
    flex-direction: column;

    justify-content: center;
    align-items: center;
  }

  #values {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;


    flex-wrap: wrap;

    gap: 50px;
  }
}

@media only screen and (max-width: 1500px) {
  #values {
    grid-template-columns: 1fr 1fr !important;
  }
}

@media only screen and (max-width: 800px) {
  #values {
    grid-template-columns: 1fr !important;
  }
}
</style>