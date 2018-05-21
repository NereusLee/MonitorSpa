<template>
  <div id="app">
    <div id="loading" v-show="loading">
      <img src="@/assets/loading.gif" alt="">
    </div>
    <!--<router-link to='/test'>go to test</router-link><br />-->
    <!--<router-link to='/hello/startStyle'>StartStyle</router-link>-->
    <!--<router-link to='/hello/channel'>Channel</router-link><br />-->
    <!--<router-link to='/monitor/news'>monitor news</router-link>-->
    <!--<router-link to='/monitor/kuaibao'>monitor kuaibao</router-link><br />-->
    <router-view></router-view>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: 'App',
  computed:{
      ...mapState(['loading'])
  },
}
</script>

<style>
#app {
  margin: 0 auto 40px;
  padding-bottom: 20px;
  width: 95%;
  position: relative;
}
#loading{
  width: 100%;
  height: 100%;
  background-color: #fff;
  opacity: 0.7;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
}
#loading>img{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

</style>
