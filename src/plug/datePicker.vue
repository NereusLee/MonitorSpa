<template>
  <div class="block">
    <span class="demonstration">请选择查询起止日期:</span>
    <!-- {{value6}} -->
    <el-date-picker
      v-model="value"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期" 
      value-format="yyyyMMdd"
      @change='search(value)'
      >
    </el-date-picker>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value: '',
      }
    },
      methods:{
        search(arr){
          console.log(arr[1])
        }
      }
  };
</script>

<style lang="scss">
  .date-body{
    width: 100%;
    overflow: hidden;

    .block{
      display: inline-block;
      float:left;
      margin-right: 20px;
    }
  }
</style>