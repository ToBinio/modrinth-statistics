<script setup lang="ts">
</script>

<template>
  <div id="page">
    <div id="nav" class="border-b-2 border-b-zinc-800">
      <div class="compact">
        <ModrinthLink/>
        <div id="icons">
          <NuxtLink id="github" to="https://github.com/ToBinio/modrinth-statistics" target="_blank" aria-label="Github of this Project">
            <Icon name="mdi:github" size="40"/>
          </NuxtLink>
        </div>
      </div>
      <ModrinthLink class="big"/>
      <NuxtLink href="/charts" active-class="active-link !to-cyan-500" class="group font-bold flex items-center gap-2 text-3xl text-transparent! from-white to-white bg-gradient-to-br bg-clip-text hover:!from-cyan-200 hover:!to-cyan-600">
        <Icon name="ph:chart-line" size="35" class="bg-gradient-to-br from-white group-hover:from-cyan-200 group-hover:to-cyan-600 group-[.active-link]:!to-cyan-500"/>
        Charts
      </NuxtLink>
      <div class="big" id="icons">
        <NuxtLink id="github" to="https://github.com/ToBinio/modrinth-statistics" target="_blank" aria-label="Github of this Project">
          <Icon name="mdi:github" size="40"/>
        </NuxtLink>
      </div>
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
    .compact{
      display: none;
    }

    z-index: 10;

    padding: 10px;
    margin: 10px;

    display: flex;

    justify-content: space-between;
    align-items: center;

    gap: 50px;

    #header {
      font-weight: bold;
      font-size: xx-large;
    }

    #icons {
      display: flex;
      gap: 25px;

      #github {
        display: block;
        transition: 0.1s scale ease-in-out;

        &:hover {
          scale: 1.05;
        }
      }
    }

    button {
      color: black;
    }
  }

  #main {
    flex: 1;
    position: relative;

    display: flex;
    flex-direction: column;
  }
}

@media only screen and (max-width: 700px) {
  #nav {
    .compact{
      display: flex !important;
      gap: 20px;
    }

    .big{
      display: none !important;
    }

    gap: 20px !important;
    flex-direction: column;
    #icons {
      gap: 10px !important;
      display: flex;
      align-items: center;
    }
  }
}
</style>

