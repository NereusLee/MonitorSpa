<template>
    <div class="monitor">
        <myMenu :theme="theme" :menuList="menuList" @switchCarts="switchCarts" :myStyle="{width:'240px'}"></myMenu>

        <div class="charts">
            <!--放大后的图表位置-->
            <div class="bigBackground" v-if="showBig">
                <div class="big-chart">
                    <chart2
                            :option="optionBig"
                            :initFlag="true"
                            @closeIt="closeIt"
                            :compareToBig="compareToBig"
                    ></chart2>
                </div>
            </div>
            <el-row :gutter="40">
                <el-col :span="8" v-for="(x,index) in list" :key="x.id">
                    <chart2 style="max-height: 430px"
                            :option="x"
                            :initFlag="false"
                            @expand="bigger"
                            @compareFromBig="compareFromBig"
                    ></chart2>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapState} from 'vuex'
    import chart2 from '@/plug/Chart2'
    import myMenu from '@/plug/myMenu'
    import {Button} from 'iview'

    const log = console.log.bind(this)

    export default {
        name: "monitor",
        components: {
            Button, myMenu, chart2
        },
        data() {
            return {
                kuaibao: {

                    // attrid:[463214,456035,455985,475112],
                    list: [
                        {mixid: 7997, attrid: 463214, title: '快报 golang接入层 内搜推荐兜底数'},
                        {mixid: 7997, attrid: 456035, title: '快报 golang接入层 请求总量'},
                        {mixid: 7997, attrid: 455985, title: '快报 golang接入层 请求成功量'},
                        {mixid: 7997, attrid: 475112, title: '快报 golang接入层 推荐条数少于请求条数'}
                    ],
                    menuList: ['接入层']
                },
                news: {
                    list: [
                        {mixid: 7364, attrid: 435024, title: '新闻 接入层 列表页总调用量'},
                        {mixid: 7364, attrid: 435027, title: '新闻 接入层 要闻频道调用量'},
                        {mixid: 8891, attrid: 484451, title: '新闻 接入层 要闻推荐兜底调用量'},
                        {mixid: 8891, attrid: 484452, title: '新闻 接入层 二级频道推荐兜底调用量'},
                        {mixid: 7383, attrid: 435498, title: '新闻 push推送 地域推送数请求总量'}
                    ],
                    menuList: ['接入层', 'push']
                },
                describe: '',
                id: 'asd',
                option: {},
                theme: 'dark',
                showBig: false,
                optionBig: {},
                compareToBig:[],
                list:''
            }
        },
        computed: {
            ...mapState(['monitorData']),
            // list() {
            //     return this.$route.params.type == 'kuaibao' ? this.kuaibao.list : this.news.list
            // },
            menuList() {
                let ids = this.$route.params.type == 'kuaibao' ? this.kuaibao : this.news;
                return ids.menuList
            }
        },
        watch: {
            $route() {
                this.switchCarts('接入层')
                // let ids = this.$route.params.type == 'kuaibao' ? this.kuaibao : this.news;
                // this.getMonitorData(ids.list)
            }
        },
        methods: {
            ...mapActions(['getMonitorData']),
            switchCarts(n) { //只负责传递menu选中的数据,由computed来进行筛选
                let ids = this.$route.params.type == 'kuaibao' ? this.kuaibao : this.news;
                let arr = ids.list.filter(item => {
                    return item.title.match(n)
                })
                this.list = arr
            },
            bigger(opt) {
                this.showBig = true
                this.optionBig = opt
            },
            closeIt(){
                this.showBig = false
            },
            compareFromBig(n){
                this.compareToBig = n
            }

        },
        created() {
            // let ids = this.$route.params.type=='kuaibao'?this.kuaibao:this.news;
            // this.getMonitorData(ids.list)
            this.switchCarts('接入层')
          $('.')
        }
    }
</script>

<style lang="scss" scoped>
    @mixin center { //居中
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    html, body {
        height: 100%;
    }

    .monitor {
        display: flex;
        flex-direction: row;
        height: 100%;
        background-color: rgb(243, 243, 243);
        position: relative;
        .charts {
            position: relative;
            height: 100%;
            box-sizing: border-box;
            flex: 1;
            /*overflow: auto;*/
            min-height: 968px;
            margin-top: 35px;
            padding: 0 30px;
            .bigBackground{
                background-color: rgba(243, 243, 243,0.8);
                z-index: 5;
                width: 100%;
                height: 100%;
                position: absolute;
                .big-chart {
                    @include center;
                    width: 80%;
                    height: 74%;
                    z-index: 6;
                }
            }

            el-row {
                .el-col {
                    padding-top: 20%;
                    margin-bottom: 40px;
                    overflow: hidden;
                    /*max-height: 400px!important;*/
                }
                .el-col:before {
                    content: "";
                    display: inline-block;
                    padding-bottom: 100%;
                    width: .1px;
                    vertical-align: middle;
                }
            }
        }
    }
</style>
