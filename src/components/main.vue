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
                describe: ['图文PV', '图文UV', '视频PV', '视频UV'],
                title: ['图文PV', '图文UV', '视频PV', '视频UV']
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
                return this.startingMode.length == 0 ? sessionStorage['style'] : this.startingMode
            },
            ChannelsData() {
                return this.channelsData.length == 0 ? sessionStorage['channel'] : this.channelsData
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
                } else if (n == 'channel') {
                    this.getChannelsData()
                    this.list = this.channelsData
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
