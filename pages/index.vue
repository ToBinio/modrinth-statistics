<script setup lang="ts">
type statistics = {
  "projects": number,
  "versions": number,
  "files": number,
  "authors": number
};

const {data} = useModrinthFetch<statistics>("/statistics");
</script>

<template>
  <div id="page">
    <div id="header">
      The place for Stats all about
      <NuxtLink to="https://modrinth.com" id="modrinth">Modrinth</NuxtLink>
      <div id="unofficial">(unofficial)</div>
    </div>
    <div id="values">
      <div class="container">
        <IconCSS name="akar-icons:game-controller" size="200"/>
        <div class="text">
          <div class="value">
            {{ data?.projects.toLocaleString() }}
          </div>
          <div>
            Projects
          </div>
        </div>
      </div>
      <div class="container">
        <IconCSS name="akar-icons:attach" size="200"/>
        <div class="text">
          <div class="value">
            {{ data?.versions.toLocaleString() }}
          </div>
          <div>
            Versions
          </div>
        </div>
      </div>
      <div class="container">
        <IconCSS name="akar-icons:file" size="200"/>
        <div class="text">
          <div class="value">
            {{ data?.files.toLocaleString() }}
          </div>
          <div>
            Files
          </div>
        </div>
      </div>
      <div class="container">
        <IconCSS name="akar-icons:person" size="200"/>
        <div class="text">
          <div class="value">
            {{ data?.authors.toLocaleString() }}
          </div>
          <div>
            Authors
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#page {
  flex: 1;
  background: linear-gradient(180deg, var(--surface-100) 0%, black 100%);

  display: flex;
  flex-direction: column;
  justify-content: space-evenly;

  #header {
    text-align: center;
    font-size: 4rem;
    font-weight: bold;

    #modrinth {
      display: block;
      font-size: 5rem;

      color: transparent;
      background: linear-gradient(70deg, var(--primary-100) 30%, var(--primary-600) 70%);
      background-clip: text;

      transition: 0.2s scale ease-in-out;

      &:hover {
        scale: 1.05;
      }
    }

    #unofficial {
      font-size: large;
      color: var(--surface-400);
    }
  }

  #values {
    display: flex;
    justify-content: space-evenly;
    align-items: center;

    flex-wrap: wrap;

    .container {
      display: flex;

      gap: 10px;

      .text {
        display: flex;
        flex-direction: column;
        justify-content: center;

        .value {
          font-size: xxx-large;
        }
      }

      span {
        background: linear-gradient(70deg, var(--primary-100) 30%, var(--primary-600) 70%);
      }
    }
  }
}
</style>