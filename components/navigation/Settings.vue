<script setup lang="ts">
import DropDownButton from "~/components/util/DropDownButton.vue";
import { useSettings } from "~/composables/useSettings";
import { useVersionRange } from "~/composables/useVersionRange";

const { version, exclusive, versionTo, versionFrom } = useSettings();
const { from, to } = useVersionRange();
</script>

<template>
  <DropDownButton icon="mdi:gear">
    <div id="settings">
      <div class="setting" title="What gameVersions should be shown">
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
      <div class="setting" title="What gameVersions should be shown">
        <label for="from">from: </label>
        <select id="from" v-model="versionFrom">
          <option>
          </option>
          <option v-for="version of from">
            {{ version}}
          </option>
        </select>
      </div>
      <div class="setting" title="What gameVersions should be shown">
        <label for="to">to: </label>
        <select id="to" v-model="versionTo">
          <option>
          </option>
          <option v-for="version of to">
            {{ version}}
          </option>
        </select>
      </div>
      <div class="setting" title="Only show Versions made for a single launcher">
        <label for="exclusive">Exclusive: </label>
        <input id="exclusive" type="checkbox" v-model="exclusive">
      </div>
    </div>
  </DropDownButton>
</template>

<style scoped>
#settings {
  display: flex;
  flex-direction: column;

  gap: 10px;
  align-items: flex-start;

  .setting {
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
}
</style>
