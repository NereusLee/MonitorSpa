<template>
    <div>
        <ul>
            <li v-for="(value,key,index) in viewAttribute">
                <!--<input type="checkbox" :checked="selectedList[key]" >-->
                <Checkbox v-model="selectedList[key]" @on-change="chosen(key,value)"></Checkbox>
                {{key}}
                <Input type="text" size="small" style="width: 80px" v-model="chosenList[key]"></Input>
            </li>
        </ul>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import {Input, Checkbox, Modal} from 'iview'
import axios from 'axios'
import qs from 'qs'

const log = console.log.bind(this)
export default {
  name: 'viewAttributeSetting',
  components: {
    Input, Checkbox
  },
  data () {
    return {
      selectedList: {}, // 判断复选框是否选中
      chosenList: {}, // 与输入框的值对应
      translate: { // 参数与选项对应
        'MAX最大值': {
          data: ['maxvalue'],
          caution: ['maxalertentity.cautionvalue']
        },
        'MIN最小值': {
          data: ['minvalue'],
          caution: ['minalertentity.cautionvalue']
        },
        'WAVE值(%)': ['wavemaxvalue', 'waveminvalue']

      }
    }
  },
  computed: {
    ...mapState(['viewAttribute']),
    selected (n) {
      return n == -1 ? ' ' : n
    }
  },
  watch: {
    viewAttribute: {
      handler (n) {
        // log(n)
        for (let key in this.viewAttribute) {
          if (this.viewAttribute[key] != -1) {
            this.selectedList[key] = true
            this.chosenList[key] = this.viewAttribute[key]
          } else {
            this.selectedList[key] = false
            this.chosenList[key] = ''
          }
        }
      },
      immediate: true
    }

  },
  methods: {
    chosen (key, value) {
      log(this.chosenList[key])
      if (this.selectedList[key] == false) {
        this.chosenList[key] = ''
        this.chosenList = {...this.chosenList}
      }
    },
    sendSetting () {
      let paramsData = this.chosenList
      for (let key in paramsData) {
        if (!paramsData[key]) {
          delete paramsData[key]
        }
      }
      paramsData.action = 'editgraphalert'
      axios({
        method: 'post',
        url: 'http://test.lg.webdev.com/proxy/monitorRequest',
        data: qs.stringify({
          ...paramsData
        })
      }).then(res => {
        log(res)
      })
    }
  },
  created () {
    // log(this.viewAttribute)
    // log(this.sendSetting)
  }
}
</script>

<style scoped type="scss">
    ul{
        list-style-type: none;
        li{
            float: left;
            display: inline;
        }
    }
</style>
