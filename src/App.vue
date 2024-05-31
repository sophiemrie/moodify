<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: linear-gradient(45deg, #ff6b6b, #ffcc5c, #88d8b0, #4da6ff, #b76eff);
}
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
