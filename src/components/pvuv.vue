<template>
    <div>
        <el-row>
            <el-col :span="24">
                <query-condition :rou="this.$route.params.id"></query-condition>
            </el-col>
        </el-row>
        <el-row>
            <ul id="charts">
                <el-col :span="12" v-for="(x,index) in list">
                    <li>
                        <chart :id="x.id" :option="x.option"  :describe="describe[index]"></chart>
                    </li>
                </el-col>
            </ul>
        </el-row>
    </div>
</template>
<script>
    function GetDateStr(AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1);//获取当前月份的日期，不足10补0
        var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();//获取当前几号，不足10补0
        return '' + y + m + d;
    }
    const log = console.log.bind(this)
    import {mapState, mapActions, mapMutations} from 'vuex'
    // 导入chart组件
    import chart from '@/components/Chart.vue'
    import checkBox from '@/components/checkbox.vue'
    import QueryCondition from '@/plug/QueryCondition'
    export default {
        name: 'app',
        data() {
            return {
                list: [],
                describe: ['图文PV', '图文UV','视频UV','视频PV'],
                title: ['图文PV', '图文UV','视频UV','视频PV'],
                first:true  //初次加载
            }
        },
        components: {
            QueryCondition,
            chart,
            checkBox,
            Date
        },
        computed: {
            ...mapState(['startingMode', 'channelsData']),
            StartingMode() {
                return this.startingMode
            },
            ChannelsData() {
                return this.channelsData
            }
        },
        watch: {
            StartingMode(n) {
                log(n)
                this.list = this.startingMode
            },
            ChannelsData(n) {
                log(n)
                this.list = this.channelsData
            },
            $route(m) {
                let n = m.params.id
                this.repaint(n)
                log(this.list)
            }
        },
        methods: {
            ...mapActions(['getStartingMode', 'getChannelsData']),
            repaint(n) {
                // console.log(n)
                if (n == 'startStyle') {
                    this.getStartingMode()
                    this.list = this.startingMode
                } else if (n == 'channel'&&this.first) {
                    let seDate = [GetDateStr(-5),GetDateStr(0)]
                    this.getChannelsData({date:seDate ,channel:`news_news_top,news_news_ent,news_news_finance,news_news_sports,news_news_tech,news_topic`})
                    this.first = false
                    // this.list = this.channelsData
                }
            }
        },
        created() {
            // this.list =
            let n = this.$route.params.id
            this.repaint(n)
            log(this.list)
        }
    }

</script>
<style lang="scss" scoped>
    ul {
        list-style-type: none;
        overflow: hidden;
        /*width:80%;*/
        li {
            /*float: left;*/
            width: 95%;

            /*chart {*/
                /*height: 80%;*/
                /*border: none;*/
            /*}*/
        }
        li:nth-child(even) {
            /*单数序号的li*/
            /*margin-left: 30px;*/
        }
    }

    .el-row {
        margin-bottom: 20px;
        &:last-child {
            margin-bottom: 0;
        }
    }

    .el-col {
        border-radius: 4px;
    }
</style>
