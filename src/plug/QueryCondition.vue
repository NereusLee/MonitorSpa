<template>
    <div class="block">
        <span class="demonstration">请选择查询起止日期:</span>
        <!-- {{value6}} -->
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
                v-if="this.rou=='channel'"
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
    import {mapState, mapActions,mapMutations} from 'vuex'
    const log = console.log.bind(this)
    export default {
        props: {
            rou: {
                type: String
            }
        },
        components:{
        },
        data() {
            return {
                options: [{
                    value: '选项1',
                    label: 'news_news_sports'
                }, {
                    value: '选项2',
                    label: 'news_news_top'
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
        computed:{
            ...mapState(['myChannels']),
            // myCN(){
            //     return this.myChannels
            // }
        },
        created() {
            // log(this.rou)
        },
        methods: {
            ...mapActions(['getStartingMode', 'getChannelsData']),
            ...mapMutations(['changeMyChannels']),
            search() {
                this.but.loading = true
                if(this.rou == 'channel'){
                    this.changeMyChannels(this.channels.join(','))
                }
                let goSearch = this.rou == 'startStyle' ? this.getStartingMode(this.seDate) : this.getChannelsData({date:this.seDate, channel:this.channels.join(',')})
                goSearch.then(() => {
                    this.but.loading = false
                })
            }
        }
    };
</script>

<style lang="scss">
    .date-body {
        width: 100%;
        overflow: hidden;
        .demonstration{
            font-weight: 800;
        }
        .block {
            display: inline-block;
            float: left;
            margin-right: 20px;
        }
    }
</style>