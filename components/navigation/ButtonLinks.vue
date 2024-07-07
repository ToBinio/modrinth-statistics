<script setup lang="ts">
import Links from "~/components/navigation/Links.vue";
import DropDownButton from "~/components/util/DropDownButton.vue";
</script>

<template>
  <DropDownButton icon="ion:stats-chart">
    <div id="links">
      <Links/>
    </div>
  </DropDownButton>
</template>

<style scoped>
#links {
  display: flex;
  flex-direction: column;

  gap: 20px;
}

:deep(select) {
  padding: 5px 10px;
  background: var(--surface-300);

  border-radius: 5px;
}
</style>