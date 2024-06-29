<script setup lang="ts">
defineProps<{
  icon: string
}>()

const open = ref(false)
</script>

<template>
  <div id="main">
    <button @click="open = !open">
      <Icon :name="icon" size="40"/>
    </button>

    <Teleport v-if="open" to="#nav">
      <div id="clickHandler" @click="open = false"></div>
    </Teleport>
    <div v-if="open" id="popup">
      <slot/>
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

  #popup {
    z-index: 100;
    position: absolute;

    right: 0;
    top: 50px;

    background-color: var(--surface-200);
    padding: 10px;
    border-radius: 10px;
  }
}
</style>