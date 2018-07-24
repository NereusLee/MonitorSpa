// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import pvuv from "./pvuv.vue";
import router from "@/router";
import { showChart } from "@/js/chart";
import axios from "axios";
import store from "@/vuex";
// import ElementUI from 'element-ui'
// import "element-ui/lib/theme-chalk/index.css";
import "iview/dist/styles/iview.css";
// import {
//   Row,
//   Col,
//   DatePicker,
//   Button,
//   Tooltip,
//   Option,
//   Select
// } from "element-ui";
// import ViserVue from "viser-vue";
// import G2 from "@antv/g2";
import "@/assets/animate.min.css";

// Vue.prototype.$ELEMENT = { size: "small" };
// Vue.use(Row);
// Vue.use(Col);
// Vue.use(Button);
// Vue.use(DatePicker);
// Vue.use(Tooltip);
// Vue.use(Option);
// Vue.use(Select);
// Vue.use(ViserVue);
// Vue.use(G2);

Vue.config.productionTip = false;

// Vue.prototype.$showChart = showChart;

new Vue({
  router,
  store,
  render: h => h(pvuv)
}).$mount("#app");
