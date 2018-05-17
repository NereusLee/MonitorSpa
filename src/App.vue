<template>
  <div id="app">
    <router-link to='/test'>go to test</router-link><br />
    <router-link to='/hello/startStyle'>StartStyle</router-link>
    <router-link to='/hello/channel'>Channel</router-link>
    <router-link to='/monitor'>go to monitor</router-link><br />
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  margin: 0 auto 40px;
  padding-bottom: 20px;
  width: 95%;
}
</style>
