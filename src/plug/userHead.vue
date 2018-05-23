<template>
    
</template>

<script>
    import {Icon} from 'iview'
    export default {
        name: "userHead",
        methods:{
           getCookie(cname) {   //获取cookie中的指定值
                var name = cname + "=";
                var ca = document.cookie.split(';');
                for(var i=0; i<ca.length; i++) {
                    var c = ca[i].trim();
                    if (c.indexOf(name)==0) return c.substring(name.length,c.length);
                }
                return "";
            }
        }
    }
</script>

<style scoped>

</style>