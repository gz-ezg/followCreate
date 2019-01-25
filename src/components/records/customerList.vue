<template>
    <van-dialog
        v-model="name_open"
        :show-confirm-button="false"
        :close-on-click-overlay="true"
        >
        <form action="/">
            <van-search placeholder="请输入归属客户名称搜索" v-model="searchname" @click="search"/>
        </form>
        <van-radio-group v-model="select_name_id">
            <van-cell-group>
                <van-cell v-for="item in clientList" :key="item.ID" clickable @click="choose(item)">
                    <van-col span="22"><div>{{item.NAME}}</div></van-col>
                    <van-col span="2"><van-radio :name="item.ID" /></van-col>
                </van-cell>
            </van-cell-group> 
        </van-radio-group>
    </van-dialog>
</template>

<script>
export default {
  data() {
    return {
      searchname: "",
      name_open: false,
      select_name_id: "",
      clientList: ""
    };
  },
  methods: {
    search() {
      let _self = this;
      // let url = `api/legwork/apiQueryCompanyOrCustomerMsg`;
      let url = "api/customer/list";
      let config = {
        params: {
          name: _self.searchname,
          page: 1,
          pageSize: 5
        }
      };

      function success(res) {
        _self.clientList = res.data.data.rows;
      }
      _self.$Get(url, config, success);
    },
    choose(e) {
      let _self = this;
      _self.select_name_id = e.ID;
      _self.$Bus.emit("UPDATA_CLIENT", e);
      _self.name_open = false;
    }
  },
  created() {
    let _self = this;
    _self.$Bus.off('OPEN_NAME_LIST');
    _self.$Bus.on("OPEN_NAME_LIST", e => {
      _self.name_open = true;
      _self.search();
    });
  },
  watch: {
    searchname: "search"
  }
};
</script>

<style>
.van-field__clear,
.van-field__icon {
  margin-right: 0px;
}
</style>
