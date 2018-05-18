<template>
    <div>
            <ul>
                <li v-for="(x,index) in list" :key="x.id">
                    <chart :id="x.id" :option="x.option" :describe="x.describe"></chart>
                </li>
            </ul>
    </div>
</template>

<script>
    const log = console.log.bind(this)
    import {mapActions,mapState} from 'vuex'
    import chart from '@/components/Chart'
    import {Button} from 'iview'
    export default {
        name: "monitor",
        components:{
            chart,Button
        },
        data(){
            return {
                kuaibao:{
                    mixid:7997,
                    attrid:[463214,456035,455985,475112],
                    title:[
                        '快报 golang接入层 内搜推荐兜底数',
                        '快报 golang接入层 请求总量',
                        '快报 golang接入层 请求成功量',
                        '快报 golang接入层 推荐条数少于请求条数'
                    ]
                },
                news:{
                    mixid:7364,
                    attrid:[435024,435027,484451,484452,435498],
                    title:[
                      '新闻 接入层 列表页总调用量',
                      '新闻 接入层 要闻频道调用量',
                      '新闻 接入层 要闻推荐兜底调用量',
                      '新闻 接入层 二级频道推荐兜底调用量',
                      '新闻 push推送 地域推送数请求总量'
                    ]
                },
                describe:'',
                id:'asd',
                option:{}
            }
        },
        computed:{
            ...mapState(['monitorData']),
            list(){
                return this.monitorData
            }
        },
        // watch:{
        //   list(n){
        //       log(n)
        //       this.getData()
        //     }
        // },
        methods:{
            ...mapActions(['getMonitorData']),
            getData(){
                let ids = this.$route.params.type=='kuaibao'?this.kuaibao:this.news;
                log(ids)
                this.getMonitorData({mixid:ids.mixid,attrid:ids.attrid,title:ids.title})
            }

        },
        created(){
            this.getData()
        }
    }
</script>

<style scoped>

</style>