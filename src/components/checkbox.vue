<template>
    <div>
        <el-checkbox-group v-model="checkboxGroup1" size="small">
            <el-checkbox v-for="x in cities" :key="x" :label="x" true-label="'hh'" border @change="show(x)"></el-checkbox>
        </el-checkbox-group>
        <el-checkbox-button v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox-button>
    </div>
</template>

<script>
    // import { elCheckboxButton } from 'element-ui';
    export default {
        name: "checkbox",
        components:{
            // elCheckboxButton
        },
        data(){
            return {
                checkboxGroup1:'深圳',
                checkboxGroup2:'深圳',
                cities:['上海', '北京', '广州', '深圳'],
                checked3:true
            }
        },
        methods:{
            show(n){
                console.log(this.$router)
            }
        }
    }
</script>

<style scoped>

</style>