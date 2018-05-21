<template>
    <div :option="option">
        <div class="chart-head">
            <div class="describe">
                {{title}}
                <!--介绍文字和图标-->
                <el-tooltip class="item" effect="light" :content="describe" placement="right-start">
                    <el-button class='el-but'><Icon type="information-circled"></Icon></el-button>
                </el-tooltip>
            </div>
        </div>
        <div class="x-bar">
            <p :id="id"></p>
        </div>
    </div>
</template>
<script>
    import Highcharts from 'highcharts'
    import {Icon} from 'iview'

    export default {
        // 验证类型
        props: {
            id: {
                type: String
            },
            option: {
                type: Object
            },
            describe: {
                type: String
            }
        },
        components:{
          Icon
        },
        data() {
            return {
                title: ''
            }
        },
        watch: {
            option(n) {
                this.title = this.option.title
                // this.$nextTick(()=>{
                    Highcharts.chart(this.id, this.option.option)
                // })
            }
        },
        // mounted() {
        //     // console.log(typeof(this.option.series[0]['data'][0]))
        //     Highcharts.chart(this.id, this.option)
        // },
        created() {
            // console.log(this.id)
            this.title = this.option.title
            this.$nextTick(() => {
                Highcharts.chart(this.id, this.option.option)
            })

        }
    }
</script>

<style lang="scss" scoped>
    .x-bar {
        border: none;
    }

    .chart-head {
        height: 30px;
        position: relative;
        margin: 0;
        padding: 0;
        height: 50px;
    }
    .describe{
        display: inline;
        position: absolute;
        top: 50%;
        left: 56%;
        transform: translate(-50%, -50%);
        font-size: 15px;
    }
    .el-button {
        border: none;
        .ivu-icon {
            color: rgb(245, 181, 58);
        }
        .el-tooltip__popper is-light {
            background-color: rgb(255, 231, 147);
        }
    }
</style>