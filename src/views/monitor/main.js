// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import monitor from "./monitor.vue";
import router from "@/router";
// import { showChart } from "@/js/chart";
// import axios from "axios";
import store from "@/vuex";
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import "iview/dist/styles/iview.css";
// import { Row, Col, DatePicker, Button, Tooltip, Option, Select } from 'element-ui'
// import ViserVue from 'viser-vue'
// import G2 from "@antv/g2";
import "@/assets/animate.min.css";

// Vue.use(G2);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(monitor)
}).$mount("#app");
