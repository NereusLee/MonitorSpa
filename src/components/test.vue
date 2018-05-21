<template>
    <div>
        <el-date-picker
                size="small"
                v-model="seDate"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyyMMdd"
        >
        </el-date-picker>
        <el-select
                v-model="channels" multiple
                placeholder="请选择频道"
                size="small"
        >
            <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label">
            </el-option>
        </el-select>
        <el-button type="primary" size="small" :loading="but.loading" icon="el-icon-search" @click="search">{{but.word}}</el-button>
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
    let log = console.log.bind(this)
    import axios from 'axios'
    export default {
        name: "test",
        data() {
            return {
                options: [{
                    value: '选项1',
                    label: 'nwef'
                }, {
                    value: '选项2',
                    label: 'ghmn'
                }, {
                    value: '选项3',
                    label: '蚵仔煎'
                }, {
                    value: '选项4',
                    label: '龙须面'
                }, {
                    value: '选项5',
                    label: '北京烤鸭'
                }],
                channels: [], //所选频道
                seDate: '', //起止日期
                but: {
                    loading: false,
                    word: '查询'
                }
            }
        },
        methods:{
            pick(n){
                // log(n)
            },
            search(){
                log(this.seDate,this.channels)
                this.getCsData(this.seDate)
            },
            getCsData(date) { //获取启动方式分组的数据
                let arg = arguments[0]||[GetDateStr(-5),GetDateStr(0)]
                log(arg.join(','),arg[0])
                let url = `http://yd.lg.webdev.com/accesslayer/NewsdailyPVUV/GetSimgleTrendChart?sdate=${arg[0]}&edate=${arg[1]}`
                axios(url).then(dat => {
                    let res = dat.data
                })
            },
        }
    }
</script>

<style scoped>

</style>