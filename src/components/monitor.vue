<template>
    <div class="monitor">
        <myMenu :theme="theme" :menuList="menuList" @switchCarts="switchCarts" :myStyle="{width:'240px'}"></myMenu>
        <!--<el-row>-->
            <ul class="charts">
                <el-col :span="12" v-for="(x,index) in list" :key="x.id">
                    <li>
                        <chart :id="x.id" :option="x.option" :describe="x.describe"></chart>
                    </li>
                </el-col>
            </ul>
        <!--</el-row>-->
    </div>
</template>

<script>
    const log = console.log.bind(this)
    import {mapActions,mapState} from 'vuex'
    import chart from '@/components/Chart'
    import myMenu from '@/plug/myMenu'
    import {Button} from 'iview'
    export default {
        name: "monitor",
        components:{
            chart,Button,myMenu
        },
        data(){
            return {
                kuaibao:{

                    // attrid:[463214,456035,455985,475112],
                    list:[
                        {mixid:7997,attrid:463214,title:'快报 golang接入层 内搜推荐兜底数'},
                        {mixid:7997,attrid:456035,title:'快报 golang接入层 请求总量'},
                        {mixid:7997,attrid:455985,title:'快报 golang接入层 请求成功量'},
                        {mixid:7997,attrid:475112,title:'快报 golang接入层 推荐条数少于请求条数'}
                    ],
                    menuList:['接入层']
                },
                news:{
                    list:[
                        {mixid:7364,attrid:435024,title:'新闻 接入层 列表页总调用量'},
                        {mixid:7364,mixid:7364,attrid:435027,title:'新闻 接入层 要闻频道调用量'},
                        {mixid:8891,attrid:484451,title:'新闻 接入层 要闻推荐兜底调用量'},
                        {mixid:8891,attrid:484452,title:'新闻 接入层 二级频道推荐兜底调用量'},
                        {mixid:7383,attrid:435498,title:'新闻 push推送 地域推送数请求总量'}
                    ],
                    menuList:['接入层','push']
                },
                describe:'',
                id:'asd',
                option:{},
                theme:'dark'
            }
        },
        computed:{
            ...mapState(['monitorData']),
            list(){
                return this.monitorData
            },
            menuList(){
                let ids = this.$route.params.type=='kuaibao'?this.kuaibao:this.news;
                return ids.menuList
            }
        },
        watch:{
            $route() {
                let ids = this.$route.params.type=='kuaibao'?this.kuaibao:this.news;
                this.getMonitorData(ids.list)
            }
        },
        methods:{
            ...mapActions(['getMonitorData']),
            // getData(list){
            //     // let ids = this.$route.params.type=='kuaibao'?this.kuaibao:this.news;
            //     this.getMonitorData({list:list})
            // },
            switchCarts(n){ //只负责传递menu选中的数据,由computed来进行筛选
                let ids = this.$route.params.type=='kuaibao'?this.kuaibao:this.news;                      let arr = ids.list.filter(item=>{
                    return item.title.match(n)
                })
                // log(arr)
                this.getMonitorData(arr)
            }

        },
        created(){
            let ids = this.$route.params.type=='kuaibao'?this.kuaibao:this.news;
            this.getMonitorData(ids.list)
        }
    }
</script>

<style lang="scss" scoped>
    html,body{
        height: 100%;
    }
    .monitor{
        display: flex;
        flex-direction: row;
        height: 100%;
        .charts{
            height: 100%;
            box-sizing: border-box;
            flex:1;
            overflow: auto;
            min-height: 968px;
            margin-top: 35px;
            li{
                /*float:left;*/
            }
        }
    }
</style>