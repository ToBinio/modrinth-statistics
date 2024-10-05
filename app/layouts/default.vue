<script setup lang="ts">
</script>

<template>
  <div id="page">
    <div id="nav">
      <div class="compact">
        <NuxtLink id="header" href="/">
          Modrinth Statistics
        </NuxtLink>
        <div id="icons">
          <NuxtLink id="github" to="https://github.com/ToBinio/modrinth-statistics" target="_blank">
            <Icon name="mdi:github" size="40"/>
          </NuxtLink>
        </div>
      </div>
      <NuxtLink class="big" id="header" href="/">
        Modrinth Statistics
      </NuxtLink>
      <div id="navBody">
      </div>
      <div class="big" id="icons">
        <NuxtLink id="github" to="https://github.com/ToBinio/modrinth-statistics" target="_blank">
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

    border-bottom: 2px solid var(--surface-200);

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

@media only screen and (max-width: 1610px) {
  #header {
    width: min-content !important;
  }
}

@media only screen and (max-width: 1470px) {
  #navBody{
    overflow: scroll;
    width: 100%;
  }
}

@media only screen and (max-width: 700px) {
  #nav {

    #header {
      width: 100% !important;
    }

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

