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
@import url('https://fonts.googleapis.com/css2?family=Shrikhand&display=swap');

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #FFF9E8;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

h1 {
  font-family: Shrikhand;
  color: #6482F4;
  font-size: 3em;
  letter-spacing: 1px;
}

h2 {
  font-family: Shrikhand;
  color: #6482F4;
  font-size: 2.5em;
  letter-spacing: 1px;
}

h3 {
  font-family: Shrikhand;
  color: #6482F4;
  font-size: 2em;
  letter-spacing: 1px;
}

button {
  background-color: #FFAA2B;
  color: white;
  border: none;
  padding: 10px 16px;
  font-size: 16px;
  border-radius: 16px;
  cursor: pointer;
  margin: 0 5px;
  min-width: 5em;
}

button:hover {
  background-color: #FFB636;
}



</style>
