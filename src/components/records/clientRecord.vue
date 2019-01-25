<template>
    <van-row style="overflow-x: hidden">
      <!-- <van-notice-bar
        mode="closeable"
        text="如在使用过程遇到问题或者有需要改进的地方，请及时联系技术部！"
      /> -->
        <van-row>
            <van-nav-bar
              title="新增客户跟进记录"
              style="background-color:#CC3300;color:white"
            />
            <van-cell-group style="margin:auto">
              <div @click="openCompanySearch">
                <van-field v-model="companyName" label="公司名称" placeholder="请选择公司名称" disabled/>
              </div>
              <div @click="openCompanySearch">
                <van-field v-model="belongClient" label="客户名称" placeholder="请选择客户名称" disabled/>
              </div>
              <div @click="openType" v-if="isShow">
                <van-field v-model="followTypeName" label="跟进类型" placeholder="请选择跟进类型" disabled/>
              </div>
              <van-switch-cell v-model="isClue" title="生成线索" size="22px"/>
              <div>
                <van-field v-model="followMsg" placeholder="请输入跟进内容！(必填项)" type="textarea"  autosize/>
              </div>
            </van-cell-group>

            <div style="width:80%;margin:20px auto;">
                <center >
                    <van-uploader accept="image/*" :before-read="upload">
                        <van-icon name="photograph"/><span>  选择文件</span>
                    </van-uploader>
                </center>
            </div>
            <div style="margin-top:10px">
                <van-row>
                    <van-col v-for="(item,index) in show_img" :key="index" style="margin-left:3px;margin-right:3px">
                        <img :src="item.src" alt="无效图片" style="width: 100px;height:100px"/>
                    </van-col>
                </van-row>
            </div>
        </van-row>
         <van-tabbar style="margin-top:30px;">
            <van-button type="primary" bottom-action style="font-size:20px;border-radius:5px;background-color:#CC3300" :loading="followUp_loading" @click="data_check">提交</van-button>
         </van-tabbar>
         <company-list></company-list>
         <!-- <customer-list></customer-list> -->
         <type-list :followTypeText="followTypeText"></type-list>
    </van-row>
</template>

<script>
import CompanyList from "./companyList.vue";
import CustomerList from "./customerList.vue";
import TypeList from "./typeList.vue";

import { yasuo } from "../../libs/img_beforeUpload.js";

export default {
  components: {
    CompanyList,
    CustomerList,
    TypeList
  },
  data() {
    return {
      isClue: false,
      isShow: true,
      userId: "",
      companyName: "",
      companyId: "",
      belongClient: "",
      customerId: "",
      followMsg: "",
      followType: "",
      followTypeName:"",
      type_typecode: "",
      show_img: [],
      img_array: [],
      followUp_loading: false,
      followTypeText: []
    };
  },
  methods: {
    openCompanySearch() {
      let _self = this;
      let userrole = "";
      userrole = localStorage.getItem("Main_Role");
      if (userrole == "salers") {
        _self.userId = _self.$route.params.id;
      } else {
        _self.userId = "";
      }
      _self.$Bus.emit("OPEN_COMPANY_LIST", _self.userId);
    },
    openNameSearch() {
      this.$Bus.emit("open_name_list", true);
    },
    openType() {
      this.$Bus.emit("OPEN_TYPE_LIST", true);
    },
    upload(e) {
      let _self = this;
      let img = yasuo(e, _self.img_array);
      let reader = new FileReader();
      reader.readAsDataURL(e);
      let filename = e.name;
      reader.onload = function(e) {
        var imgMsg = {
          name: filename,
          src: this.result
        };
        _self.show_img.push(imgMsg);
      };
    },
    // 跟进类型
    GetFollowUpType() {
      var _self = this;
      _self.followTypeText = [];
      let params = "markert_follow_up_type";

      function success(res) {
        for (let i = 0; i < res.data.data.markert_follow_up_type.length; i++) {
          var temp = {};
          if (res.data.data.markert_follow_up_type[i].typecode == 21 ||res.data.data.markert_follow_up_type[i].typecode == 22) {

          } else {
              temp.typecode = res.data.data.markert_follow_up_type[i].typecode;
              temp.typename = res.data.data.markert_follow_up_type[i].typename;
              temp.id = res.data.data.markert_follow_up_type[i].id;
              _self.followTypeText.push(temp);
            }
          }
        }
      _self.$GetDataCenter(params, success);
    },
    data_check() {
      let _self = this;
      if ( _self.companyName && _self.belongClient && _self.followType &&_self.followMsg) {
        _self.submit();
      } else {
        _self.$toast.fail("请完善信息！");
      }
    },
    // 提交
    submit() {
      let _self = this;
      _self.followUp_loading = true;
      if (_self.img_array.length == 0) {
        _self.add_workorder_followup();
      } else {
        let formdata = new FormData();
        for (let i = 0; i < _self.img_array.length; i++) {
          formdata.append( "files", _self.img_array[i], "file_" + Date.parse(new Date()) + ".jpg");
        }
        let url = `/api/customer/addCustomerContentImg`;
        function success(res) {
          let temp = [];
          for (let j = 0; j < res.data.data.length; j++) {
            temp.push(res.data.data[j].id);
          }
          _self.attIds = temp.toString();
          _self.add_workorder_followup();
        }
        function fail(res) {
          _self.followUp_loading = false;
          alert(res)
        }
        _self.$Post(url, formdata, success, fail);
      }
    },
    add_workorder_followup() {
      let url = `api/customer/addCustomerContentNote`;
      let _self = this;
      let config = {
        content: _self.followMsg,
        customerId: _self.customerId,
        companyId: _self.companyId,
        followUpType: _self.followType,
        attIds: _self.attIds
      };
      function success(res) {
        if(_self.isClue){
          _self.add_clue()
        }else{
          _self.followUp_loading = false;
          _self.$toast.success("新增成功！");
          _self.img_array = [];
          _self.show_img = [];
          _self.companyName = "";
          _self.companyId = "";
          _self.belongClient = "";
          _self.customerId = "";
          _self.followMsg = "";
          _self.followTypeName = ""
        }
      }
      function fail(res) {
        _self.followUp_loading = false;
      }
      _self.$Post(url, config, success, fail);
    },
    add_clue() {
      let url = `api/customer/addCustomerContentNote`;
      let _self = this;
      let config = {
        content: _self.followMsg,
        customerId: _self.customerId,
        companyId: _self.companyId,
        followUpType: "20"
      };
      function success(res) {
        _self.followUp_loading = false;
        _self.$toast.success("新增线索成功！");
        _self.img_array = [];
        _self.show_img = [];
        _self.companyName = "";
        _self.companyId = "";
        _self.belongClient = "";
        _self.customerId = "";
        _self.followMsg = "";
        _self.followTypeName = ""
      }
      function fail(res) {
        _self.followUp_loading = false;
      }
      _self.$Post(url, config, success, fail);
    },
    getRole() {
      let _self = this;
      let temp = localStorage.getItem("Main_Role");
      if (
        temp == "kuaiji" ||
        temp == "shangshi" ||
        temp == "qihua" ||
        temp == "shenji"
      ) {
        _self.isShow = false;
        switch (temp) {
          case "kuaiji":
            _self.followType = "18";
            break;
          case "shangshi":
            _self.followType = "17";
            break;
          case "qihua":
            _self.followType = "19";
            break;
          case "shenji":
            _self.followType = "23";
            break;
        }
      } else {
        _self.isShow = true;
      }
    }
  },
  created() {
    this.GetFollowUpType();
    this.getRole();
  },
  beforeUpdate() {
    let _self = this;
    _self.$Bus.off("UPDATA_INFO");
    _self.$Bus.off("UPDATA_TYPE");
    _self.$Bus.on("UPDATA_INFO", e => {
      _self.companyName = e.companyName;
      _self.belongClient = e.customerName;
      _self.companyId = e.companyId;
      _self.customerId = e.customerId;
    });
    _self.$Bus.on("UPDATA_TYPE", e => {
      _self.followType = e.typecode;
      _self.followTypeName = e.typename;
    });
  }
};
</script>

<style>
   .van-cell__value{
     /* font-size: 10px; */
     flex:2!important
   }
  .van-switch--on{
    background-color:rgb(204, 51, 0)!important
  }
</style>
