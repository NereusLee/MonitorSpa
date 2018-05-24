<template>
    <div id="pvuv">
        <el-row style="margin-left: 17px;">
            <el-col :span="24">
                <query-condition :rou="this.$route.params.id"></query-condition>
            </el-col>
        </el-row>
            <div id="charts">
                <el-row :gutter="40">
                <el-col :span="12" v-for="(x,index) in list">
                        <chart :id="ids[index]"
                               :option="x.option"
                               :describe="describe[index]"
                        ></chart>
                </el-col>
                </el-row>
            </div>
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
                ids:['articlepv','articleuv','videouv','videovv']
                // first:true  //初次加载
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
            // StartingMode(n) {
            //     this.list = this.startingMode
            // },
            // ChannelsData(n) {
            //     this.list = this.channelsData
            // },
            $route(m) {
                let n = m.params.id
                this.repaint(n)
            }
        },
        methods: {
            ...mapActions(['getStartingMode', 'getChannelsData']),
            repaint(n) {
                if (n == 'startStyle') {
                    let seDate = [GetDateStr(-7),GetDateStr(-1)]
                    this.getStartingMode(seDate).then(()=>{
                      this.list = this.startingMode
                    })
                } else if (n == 'channel') {
                    this.getChannelsData().then(()=>{
                      this.list = this.channelsData
                    })
                    // this.first = false
                    // this.list = this.channelsData
                }
            }
        },
        created() {
            let n = this.$route.params.id
            this.repaint(n)
        }
    }

</script>
<style lang="scss" scoped>
    #pvuv{
        padding-top: 9px;
        padding-left: 20px;
    }
    #charts {
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
        margin-bottom: 5px;
        &:last-child {
            margin-bottom: 0;
        }
    }

    #charts .el-col {
        border-radius: 4px;
        max-height: 450px;
    }
    /*#charts>.el-col-12:nth-child(even){*/
        /*margin-left: 20px!important;*/
    /*}*/
</style>
