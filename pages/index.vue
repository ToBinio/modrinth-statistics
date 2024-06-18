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
</template>

<style scoped>
#page {
  height: 100%;

  flex: 1;

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

  background: linear-gradient(180deg, var(--surface-100) 0%, black 100%);
}
</style>