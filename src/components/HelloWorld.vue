<template>
    <div>
        <check-box></check-box>
        <ul id="charts">
            <li v-for="x in list">
                <chart :id="x.id" :option="x.option"></chart>
            </li>
        </ul>
    </div>
</template>
<script>
    import {mapState, mapActions, mapMutations} from 'vuex'
    // 导入chart组件
    import chart from '@/components/Chart.vue'
    import checkBox from '@/components/checkbox.vue'

    export default {
        name: 'app',
        data() {
            return {
                list: []
            }
        },
        components: {
            chart,checkBox
        },
        computed: {
            ...mapState(['startingMode','channelsData']),
            // StartingMode() {
            //     return this.startingMode
            // },
            // ChannelsData(){
            //     return this.channelsData
            // }
        },
        watch: {
            $route(m) {
                let n = m.params.id
                this.repaint(n)
            }
        },
        methods: {
            ...mapActions(['getStartingMode', 'getChannelsData']),
            repaint(n){
                console.log(n)
                if (n == 'startStyle') {
                    if(sessionStorage['style']===undefined||sessionStorage['style']=='[]'||sessionStorage['style']==''){
                        console.log('huid')
                        this.getStartingMode()
                        sessionStorage.setItem('style',JSON.stringify(this.startingMode))
                        this.list = this.startingMode
                    }
                    this.list = JSON.parse(sessionStorage['style'])
                }
                else if (n == 'channel') {
                    if(sessionStorage['channel']===undefined||sessionStorage['channel']=='[]'||sessionStorage['channel']==''){
                        this.getChannelsData()
                        sessionStorage.setItem('channel',JSON.stringify(this.channelsData))
                        this.list = this.channelsData
                    }
                    console.log(this.channelsData)
                    this.list = JSON.parse(sessionStorage['channel'])
                }
            }
        },
        created() {
            this.repaint(this.$route.params.id)
        }
    }

</script>
<style>
    #test {
        width: 400px;
        height: 400px;
        margin: 40px auto;
    }

    ul {
        list-style-type: none;
    }

    ul li {
        float: left;
        width: 45%;
    }

    ul li:nth-child(even) { /*单数序号的li*/
        margin-left: 40px;
    }

</style>
