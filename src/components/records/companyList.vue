<template>
    <van-dialog
        v-model="company_open"
        :show-confirm-button="false"
        :close-on-click-overlay="true"
        v-if="company_open"
        >
        <form action="/">
            <van-search placeholder="请输入公司名称搜索" v-model="searchcompanyname" @click="search"/>
        </form>
        <van-radio-group v-model="select_company_id">
            <van-cell-group>
                <van-cell v-for="item in companyList" :key="item.companyid" clickable @click="choose(item)">
                    <van-col span="22"><div>{{item.companyName}}</div></van-col>
                    <van-col span="2"><van-radio :name="item.companyId" /></van-col>
                </van-cell>
            </van-cell-group>
        </van-radio-group>
    </van-dialog>
</template>

<script>
export default {
  data() {
    return {
      searchcompanyname: "",
      company_open: false,
      select_company_id: "",
      companyList: "",
      userId: ""
    };
  },
  methods: {
    search() {
      let _self = this;
      let url = "api/customer/getCompanyInfosByUserIdAndComName";
      let config = {
        params: {
          userId: _self.userId,
          companName: _self.searchcompanyname
        }
      };

      function success(res) {
        let data = res.data.data;
        _self.companyList = data.slice(0, 5);
      }

      _self.$Get(url, config, success);
    },
    choose(e) {
      console.log(e);
      let _self = this;
      _self.select_company_id = e.companyId;
      _self.$Bus.emit("UPDATA_INFO", e);
      _self.company_open = false;
    }
  },
  created() {
    let _self = this;
    _self.$Bus.off("OPEN_COMPANY_LIST");
    _self.$Bus.on("OPEN_COMPANY_LIST", e => {
      // console.log(e, "用户id");
      _self.select_company_id = ""
      _self.searchcompanyname = ""
      _self.userId = e || "";
      _self.company_open = true;
      _self.search();
    });
  },
  watch: {
    searchcompanyname: "search"
  }
};
</script>

<style>
.van-field__clear,
.van-field__icon {
  margin-right: 0px;
}
</style>
