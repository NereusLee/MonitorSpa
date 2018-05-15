<template>
    <ul id="charts">
        <li v-for="x in StartingMode">
            <x-chart :id="x.id" :option="x.option"></x-chart>
        </li>
    </ul>
</template>

<script>
    import {mapState, mapActions, mapMutations} from 'vuex'
    // 导入chart组件
    import XChart from '@/components/Chart.vue'

    export default {
        name: 'app',
        data() {
            return {

            }
        },
        components: {
            XChart
        },
        computed: {
            ...mapState(['startingMode']),
            StartingMode() {
                // .map(item=>{
                //     for(let key in item){
                //         item.option = this.$showChart(key,res.data,res.categories,'','','','line');
                //     }
                //
                // })
                let firstTitle = []
                let sm = this.startingMode.data
                for (let k1 in sm) {
                    let series = []
                    for (let k2 in sm[k1]) {
                        series.push({
                            name: k2,
                            data: sm[k1][k2]
                        })

                    }

                    firstTitle.push({id: `#${k1}`, option: this.$showChart(
                            series,
                            this.startingMode.categories,
                            '',
                            '',
                            '统计时间',
                            'line','',''

                        )})

                }
                // console.log(firstTitle[0].option)
                return firstTitle
            }
        },
        watch: {
            StartingMode(n) {
                console.log(n)
            }
        },
        methods: {
            ...mapActions(['getStartingMode'])
        },
        created() {
            this.getStartingMode()
            // this.$axios('https://api.myjson.com/bins/h878m').then(dat=>{
            //     let res = dat.data
            //     console.log(res)
            //     this.option = this.$showChart('test',res.data,res.categories,'','','','line');
            //     console.log(this.option)
            // })


        }
    }
</script>

<style>
    #test {
        width: 400px;
        height: 400px;
        margin: 40px auto;
    }
    ul{
        /*list-style-type: none;*/
    }
    ul li{
        /*float:left;*/
    }
</style>
