<script setup lang="ts">
const open = ref(false)
let version = useVersion();

</script>

<template>
  <div id="main">
    <button @click="open = !open">
      <Icon name="mdi:gear" size="40"/>
    </button>

    <Teleport v-if="open" to="#nav">
      <div id="clickHandler" @click="open = false"></div>
    </Teleport>
    <div v-if="open" id="settings">
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
    </div>
  </div>
</template>

<style scoped>
#clickHandler {
  top: 0;
  left: 0;
  position: absolute;
  height: 100vh;
  width: 100vw;

  z-index: 50;
}

#main {
  button {
    background: none;
    border: none;

    transition: 0.1s scale ease-in-out;

    &:hover {
      scale: 1.05;
    }
  }

  #settings {
    z-index: 100;
    position: absolute;

    right: 0;
    top: 50px;

    background-color: var(--surface-200);
    padding: 10px;
    border-radius: 10px;

    select {
      padding: 5px 10px;
      background: var(--surface-300);

      border-radius: 5px;
    }

    #setting {
      display: flex;
      gap: 10px;

      justify-content: center;
      align-items: center;
    }
  }
}
</style>