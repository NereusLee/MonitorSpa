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
                @change="pick"
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
    import {mapState, mapActions} from 'vuex'

    const log = console.log.bind(this)
    export default {
        props: {
            rou: {
                type: String
            }
        },
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
        created() {
            // log(this.rou)
        },
        methods: {
            ...mapActions(['getStartingMode', 'getChannelsData']),
            search() {
                this.but.loading = true
                log(typeof (this.channels.join(',')))
                let goSearch = this.rou == 'startStyle' ? this.getChannelsData(this.seDate) : this.getChannelsData({date:this.seDate, channel:this.channels.join(',')})
                goSearch.then(() => {
                    this.but.loading = false
                })
            },
            pick(){
            }
        }
    };
</script>

<style lang="scss">
    .date-body {
        width: 100%;
        overflow: hidden;

        .block {
            display: inline-block;
            float: left;
            margin-right: 20px;
        }
    }
</style>