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
  <div>
    <div>
      Projects:
      {{ data?.projects }}
    </div>
    <div>
      Versions:
      {{ data?.versions }}
    </div>
    <div>
      Files:
      {{ data?.files }}
    </div>
    <div>
      Authors:
      {{ data?.authors }}
    </div>
  </div>
</template>

<style scoped>

</style>