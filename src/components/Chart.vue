<template>
    <div>
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
            }
        },
        watch: {
            option(n){
                // console.log(n)
                HighCharts.chart(this.id,this.option)
            }
        },
        mounted(){
            // console.log(typeof(this.option.series[0]['data'][0]))
            HighCharts.chart(this.id,this.option)
        }
    }
</script>

<style scoped>

</style>