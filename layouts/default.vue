<script setup lang="ts">
import ButtonLinks from "~/components/navigation/ButtonLinks.vue";
import Links from "~/components/navigation/Links.vue";
import Settings from "~/components/navigation/Settings.vue";
</script>

<template>
  <div id="page">
    <div id="nav">
      <NuxtLink id="header" href="/">
        Modrinth Statistics
      </NuxtLink>
      <div id="fullLinks">
        <Links/>
      </div>
      <div id="icons">
        <ButtonLinks class="linksButton"/>
        <Settings/>
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

    #fullLinks {
      display: flex;
      gap: 25px;
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

@media only screen and (max-width: 1400px) {
  #header {
    width: min-content !important;
  }
}

@media only screen and (max-width: 1220px) {
  #fullLinks {
    display: none !important;
  }
}

@media only screen and (min-width: 1221px) {
  .linksButton {
    display: none !important;
  }
}

@media only screen and (max-width: 450px) {
  #nav {
    gap: 20px !important;

    #icons {
      gap: 10px !important;
    }
  }
}
</style>

