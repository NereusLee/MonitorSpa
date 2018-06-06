<template>
  <div id="app">

    <!--<router-link to='/test'>go to test</router-link><br />-->
    <!--<router-link to='/pvuv/startStyle'>StartStyle</router-link>-->
    <!--<router-link to='/pvuv/channel'>Channel</router-link><br />-->
    <!--<router-link to='/monitor/news'>monitor news</router-link>-->
    <!--<router-link to='/monitor/kuaibao'>monitor kuaibao</router-link><br />-->
    <router-view :key="$route.fullpath"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
  }
}
</script>

<style>
#app {
  margin: 0;
  width: 100%;
  position: relative;
}

</style>
