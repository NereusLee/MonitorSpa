<template>
    <div>
        <!-- <Row>
            <Input type="text" size="small" style="width: 150px" placeholder="请输入用户ID"></Input>
        </Row> -->
        <Row :gutter="16" style="margin: 0 20px;">
            <Col v-for="(value,key,index) in values" :key="'setting'+index" span="12"
                 style="margin: 8px 0;">
                <span  @click="chose(key)">
                    <Checkbox v-model="value.checked"></Checkbox>
                </span>
                {{value.title}}:
                <Input type="text" size="small" style="width: 80px"
                       :disabled = "!value.checked"
                       v-model="value[key+'value']"
                       @input="changeParams(key,value[key+'value'])"
                ></Input>
            </Col>
            <!-- <Col span="12">
                <span @click="choseCaution(key)">
                    <Checkbox v-model="value.cautionChecked"></Checkbox>
                </span>
                预警值:
                <Input type="text" size="small" style="width: 80px"
                       :disabled = "!value.cautionChecked"
                       v-model="value[key+'cautionvalue']"
                       @input="changeCaution(key,value[key+'cautionvalue'])"
                ></Input>
            </Col> -->
        </Row>
        <p style="word-break:break-all;">告警发送人：{{viewAttribute.owner}}</p>
        <p>注意:取消勾选复选框会删除该参数</p>
        <p v-if="completeShow" :style="{color:completeWord.color}"
        >{{completeWord.word}}</p>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { Input, Checkbox, Row, Col } from "iview";
import axios from "axios";
import qs from "qs";

const log = console.log.bind(this);
// const diff = function (json) {
//
// }

export default {
  name: "viewAttributeSetting",
  components: {
    Input,
    Checkbox,
    Row,
    Col
  },
  data() {
    return {
      selectedList: {}, // 判断复选框是否选中
      chosenList: {}, // 与输入框的值对应
      values: {
        // 输入框的值
        max: {
          title: "max最大值",
          maxvalue: "",
          maxcautionvalue: "",
          checked: false, // 和复选框绑定
          cautionChecked: false
        },
        min: {
          title: "min最小值",
          minvalue: "",
          maxcautionvalue: "",
          checked: false,
          cautionChecked: false
        },
        wave: {
          title: "波动值(%)",
          wavevalue: "",
          wavecautionvalue: "",
          checked: false,
          cautionChecked: false
        }
      },
      settingParams: {
        // 用于返回设置的参数
        max: {
          maxalertentity_checked: "",
          "maxalertentity.alertid": -1,
          "maxalertentity.mixtype": 2,
          "maxalertentity.value": "",
          "maxalertentity.cautionable": "",
          "maxalertentity.cautionvalue": ""
        },
        min: {
          minalertentity_checked: "",
          "minalertentity.alertid": -1,
          "minalertentity.mixtype": 2,
          "minalertentity.value": "",
          "minalertentity.cautionable": "",
          "minalertentity.cautionvalue": ""
        },
        wave: {
          wavealertentity_checked: "",
          "wavealertentity.alertid": -1,
          "wavealertentity.mixtype": 2,
          "wavealertentity.maxvalue": "",
          "wavealertentity.minvalue": "",
          "wavealertentity.cautionable": "",
          "wavealertentity.cautionvalue": ""
        }
      },
      completeShow: false,
      completeWord: "", //显示提交结果的文字
      result: {
        success: {
          color: "rgb(25,190,107)",
          word: "配置修改成功!"
        },
        fail: {
          color: "rgb(237,63,20)",
          word: "修改失败,请重试"
        }
      }
    };
  },
  computed: {
    ...mapState(["viewAttribute"]),
    selected(n) {
      return n == -1 ? " " : n;
    }
  },
  watch: {
    viewAttribute: {
      handler(n) {
        // 根据传入的参数来设置表单
        // log(n)
        let obj = {};
        Object.keys(this.values).forEach(key => {
          // key:max,min,wave
          obj[key] = {};
          Object.keys(n).forEach(kk => {
            let rep = new RegExp("id");
            if (n[kk] == -1 && !rep.test(kk)) {
              n[kk] = "";
            }
            let sel = new RegExp("^" + key);
            if (sel.test(kk)) {
              if (/id/.test(kk)) {
                this.settingParams[key][key + "alertentity.alertid"] = Number(
                  n[kk]
                );
              } else {
                obj[key][kk] = n[kk];
              }
            }
          });
          Object.assign(this.values[key], obj[key]);
        });

        this.values.wave.wavevalue = n.wavemaxvalue; //wave的值
        let val = this.values;
        for (let key in val) {
          // 将有值的项选中
          val[key].checked = !!val[key][key + "value"];
          val[key].cautionChecked = !!val[key][key + "cautionvalue"];
          let value1 = this.values[key].checked ? 1 : 0;
          let value2 = this.values[key].cautionChecked ? 1 : 0;
          this.settingParams[key][key + "alertentity_checked"] = value1;
          this.settingParams[key][key + "alertentity.cautionable"] = value2;
          // settingParams的各个value值初始化
          if (key == "wave") {
            this.settingParams[key][key + "alertentity.maxvalue"] =
              val[key][key + "value"];
            this.settingParams[key][key + "alertentity.minvalue"] =
              val[key][key + "value"];
          } else {
            this.settingParams[key][key + "alertentity.value"] =
              val[key][key + "value"];
          }
          this.settingParams[key][key + "alertentity.cautionvalue"] =
            val[key][key + "cautionvalue"];
          //mixid和attrid初始化
          this.settingParams[key][key + "alertentity.mixid"] = n.mixid;
          this.settingParams[key][key + "alertentity.attrid"] = n.attrid;
        }
      },
      immediate: true
    }
  },
  methods: {
    changeParams(key, value) {
      // 根据用户的输入来设置将要返回的参数
      if (key == "wave") {
        // 波动值上下限设成相等的
        this.settingParams[key][key + "alertentity.maxvalue"] = Number(value);
        this.settingParams[key][key + "alertentity.minvalue"] = Number(value);
      } else {
        this.settingParams[key][key + "alertentity.value"] = Number(value);
      }
    },
    // changeCaution(key, value) {
    //   // 设置预警值返回的参数
    //   this.settingParams[key][key + "alertentity.cautionvalue"] = Number(value);
    // },
    chose(key) {
      // log(key);
      let value = this.values[key].checked ? 0 : 1; // 因为该变量的值获取有延迟,所以取反
      this.settingParams[key][key + "alertentity_checked"] = value;
    },
    // choseCaution(key) {
    //   let value = this.values[key].cautionChecked ? 0 : 1;
    //   this.settingParams[key][key + "alertentity.cautionable"] = value;
    // },
    // chosen (key, value) {
    //   log(this.chosenList[key])
    //   if (this.selectedList[key] == false) {
    //     this.chosenList[key] = ''
    //     this.chosenList = {...this.chosenList}
    //   }
    // },
    sendSetting() {
      let params = {};
      for (let key in this.settingParams) {
        params = Object.assign(params, this.settingParams[key]);
      }

      for (let k1 in params) {
        // 删除空值
        if (params[k1] === "") {
          delete params[k1];
        } else {
          for (let k2 in params[k1]) {
            if (params[k1][k2] === "") delete params[k1][k2];
          }
        }
      }
      params.action = "editgraphalert";
      params.user = 23100;
      axios({
        method: "post",
        url: "/proxy/monitorRequest",
        data: qs.stringify({ ...params })
      })
        .then(res => {
          // log(res);
          this.completeWord =
            res.data.code == 0 ? this.result["success"] : this.result["fail"];
          log(this.completeWord);
          this.completeShow = true;
          this.$emit("commit");
        })
        .catch(err => {
          this.completeWord = this.result["fail"];
          this.completeShow = true;
        });
    }
  }
};
</script>

<style scoped type="scss">
ul {
  list-style-type: none;
  li {
    float: left;
    display: inline;
  }
}
</style>
