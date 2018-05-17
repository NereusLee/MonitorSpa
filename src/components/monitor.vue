<template>
    <query-condition></query-condition>
</template>

<script>
    import QueryCondition from '@/plug/QueryCondition'
    import {mapActions,mapState} from 'vuex'
    export default {
        name: "monitor",
        components:{
            QueryCondition
        },
        methods:{
            ...mapActions(['getMonitorData'])
        },
        created(){
            this.getMonitorData()
        }
    }
</script>

<style scoped>

</style>