<script setup lang="ts">
import DropDownButton from "~/components/util/DropDownButton.vue";

let version = useVersion();
</script>

<template>
  <DropDownButton icon="mdi:gear">
    <div id="setting">
      <label for="versions">Versions: </label>
      <select id="versions" v-model="version">
        <option value="major">
          Major
        </option>
        <option value="minor">
          Minor
        </option>
        <option value="all">
          All
        </option>
      </select>
    </div>
  </DropDownButton>
</template>

<style scoped>
#setting {
  display: flex;
  gap: 10px;

  justify-content: center;
  align-items: center;

  select {
    padding: 5px 10px;
    background: var(--surface-300);

    border-radius: 5px;
  }
}
</style>