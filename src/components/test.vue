<template>
    
</template>

<script>
import axios from 'axios'

const log = console.log.bind(this)
export default {
  data() {
    return {};
  },
  methods: {
    async getData() {
      let res = await axios("https://api.myjson.com/bins/q8rni");
    //   let obj = {
    //     title: ids.title,
    //     data: res.data,
    //     mixid: ids.mixid,
    //     attrid: ids.attrid
    //   };
      log(res)  
    }
  },
  created(){
      this.getData()
  }
};
</script>

<style lang="sass" scoped>

</style>
