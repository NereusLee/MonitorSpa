<template>
    <Menu ref="side_menu" :theme="theme" :active-name="activeName" @on-select="select" :style="myStyle">
        <MenuGroup :title=title>
            <MenuItem v-for="(x,index) in menuList" :key="x" :name="x" >
                <Icon type="document-text"></Icon>
                {{x}}
            </MenuItem>
        </MenuGroup>
    </Menu>
</template>
<script>
import { Menu, MenuItem, Icon, MenuGroup } from "iview";
export default {
  name: "myMenu",
  props: {
    theme: {
      type: String
    },
    menuList: {
      type: Array
    },
    myStyle: {
      type: Object
    },
    activeName: {
      type: String
    }
  },
  components: {
    Menu,
    MenuItem,
    Icon,
    MenuGroup
  },
  methods: {
    select(n) {
      this.$emit("switchCharts", n);
    }
  },
  computed: {
    title() {
      let rou = this.$route.params.type;
      let tt = "关键指标监控";
      switch (rou) {
        case "news":
          tt = "新闻" + tt;
          break;
        case "kuaibao":
          tt = "快报" + tt;
          break;
      }
      return tt;
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.$refs.side_menu.updateActiveName();
    });
  }
};
</script>

<style scoped>
.ivu-menu {
  /*width: 240px;*/
}
</style>
