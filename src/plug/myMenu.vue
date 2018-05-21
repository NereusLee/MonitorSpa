<template>
    <Menu :theme="theme" active-name="1" @on-select="select" :style="myStyle">
        <MenuGroup title="关键指标监控">
            <MenuItem v-for="(x,index) in menuList" :key="index" :name="index" >
                <Icon type="document-text"></Icon>
                {{x}}
            </MenuItem>
        </MenuGroup>
    </Menu>
</template>
<script>
    import {Menu,MenuItem,Icon,MenuGroup} from 'iview'
    export default {
        name: "myMenu",
        props:{
          theme:{
              type:String
          },
          menuList:{
              type:Array
          },
          myStyle:{
              type:Object
          },
        },
        components:{
            Menu,MenuItem,Icon,MenuGroup
        },
        methods:{
            select(n){
                // console.log(this.menuList[n])
                this.$emit('switchCarts',this.menuList[n])
            }
        }
    }
</script>

<style scoped>
    .ivu-menu{
        /*width: 240px;*/
    }
</style>