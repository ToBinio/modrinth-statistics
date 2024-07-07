<script setup lang="ts">
useHead({
	title: "Modrinth Statistics",
});

type statistics = {
	projects: number;
	versions: number;
	files: number;
	authors: number;
};

const { data } = useModrinthFetch<statistics>("/statistics");
</script>

<template>
  <div id="page">
    <div id="header">
      The place for stats all about
      <NuxtLink to="https://modrinth.com" id="modrinth" target="_blank">Modrinth</NuxtLink>
      <div id="unofficial">(unofficial)</div>
    </div>
    <div id="values">
      <div class="container">
        <Icon name="akar-icons:game-controller" size="150"/>
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
        <Icon name="akar-icons:attach" size="150"/>
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
        <Icon name="akar-icons:file" size="150"/>
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
        <Icon name="akar-icons:person" size="150"/>
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
  background: linear-gradient(180deg, var(--surface-100) 0%, var(--surface-mixed-100) 150%);

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

    #modrinth {
      display: inline-block;
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
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;


    flex-wrap: wrap;

    gap: 50px;

    .container {
      display: flex;
      justify-content: center;

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