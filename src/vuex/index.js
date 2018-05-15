import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        startingMode:{} //启动方式的数据
    },
    mutations:{
        changeStartingMdoe(state,v){
            state.startingMode = v
        }
    },
    actions:{
        getStartingMode(context){  //获取启动方式的数据
            axios('https://api.myjson.com/bins/h878m').then(dat=>{
                console.log(dat)
                let res = dat.data
                // let arr = []
                console.log(res)
                // for(let k in res.data){
                //     arr.push(res.data[k])
                // }
                context.commit('changeStartingMdoe',res)
            })
        }
    }
})