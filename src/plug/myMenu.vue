<template>
    <Menu ref="side_menu" :theme="theme" active-name="接入层" @on-select="select" :style="myStyle">
        <MenuGroup title="关键指标监控">
            <MenuItem v-for="(x,index) in menuList" :key="x" :name="x" >
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
                console.log(n)
                this.$emit('switchCarts',n)
            }
        },
        mounted(){
          this.$nextTick(function(){
            this.$refs.side_menu.updateActiveName()
          })
        }
    }
</script>

<style scoped>
    .ivu-menu{
        /*width: 240px;*/
    }
</style>
