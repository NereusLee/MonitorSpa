<template>
    <div>
        <p class="chart-head">{{title}}
        <el-tooltip class="item" effect="light" :content="describe" placement="right-start">
        <el-button class='el-but'><i class="iconfont">&#xe735;</i></el-button>
        </el-tooltip>
        </p>
        <div class="x-bar">
            <p :id="id" :option="option"></p>
        </div>
    </div>
</template>
<script>
    import HighCharts from 'highcharts'

    export default {
        // 验证类型
        props: {
            id: {
                type: String
            },
            option: {
                type: Object
            },
            title:{
                type:String
            },
            describe:{
                type:String
            }
        },
        data(){
            return {
                name:['图文PV', '图文UV', '视频PV', '视频UV'],
            }
        },
        watch: {
            option(n) {
                // console.log(n)
                HighCharts.chart(this.id, this.option)
            }
        },
        mounted() {
            // console.log(typeof(this.option.series[0]['data'][0]))
            HighCharts.chart(this.id, this.option)
        }
    }
</script>

<style lang="scss" scoped>
    .x-bar{
        border:none;
    }
    .chart-head {
        height: 30px;
        position: relative;
        text-align: center;
        margin: 0;
        padding: 0;
        .item {
            position: absolute;
            top: 0;
            left: 10px;
        }

        .el-but {
            border: none;
            .iconfont {
                color: rgb(245, 181, 58);
            }
            .el-tooltip__popper is-light {
                background-color: rgb(255, 231, 147);
            }
        }
    }
</style>