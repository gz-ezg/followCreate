<template>
  <van-row style="overflow-x: hidden">
    <van-nav-bar title="新增企业信息" style="background-color:#CC3300;color:white" />
    <van-row>
      <div style="width:80%;margin:auto">
        <van-cell-group>
          <van-cell title="归属客户" v-model="belongClient" @click="openClientList"/>
          <van-cell title="客户电话" v-model="clientTel" @click="openClientList"/>
          <van-field v-model="companyname" label="公司名称" placeholder="请输入公司名称" @blur="companyNameCheck" />
          <!-- <van-cell title="公司注册地" is-link v-model="regaddress" @click="openAdress()" /> -->
          <!-- <van-field v-model="legalperson" label="法人" placeholder="请输入法人名字" /> -->
          <van-cell title="重要等级" is-link v-model="levelvalue" @click="openLevel()" />
          <!-- <van-cell title="企业来源" is-link v-model="companysrc" @click="openSrc()" />
          <van-cell title="交易状态" is-link v-model="trading" @click="openTrading()" /> -->
          <van-cell title="企业纳税类型" is-link v-model="taxtype" @click="openTax()" />
        </van-cell-group>
      </div>
      <van-tabbar style="margin-top:30px;">
        <van-button type="primary" bottom-action :loading="saveloading" style="font-size:20px;border-radius:5px;background-color:#CC3300"
          @click="save">保存</van-button>
      </van-tabbar>
    </van-row>
    <customer-list></customer-list>
    <reg-address></reg-address>
    <import-level></import-level>
    <company-src></company-src>
    <trading-status></trading-status>
    <tax-type></tax-type>
  </van-row>
</template>
<script>
import CustomerList from "../records/customerList";
import RegAddress from "../common/regAddress";
import ImportLevel from "../common/importLevel";
import CompanySrc from "../common/companySrc";
import TradingStatus from "../common/tradingStatus";
import TaxType from "../common/taxType";
export default {
  data() {
    return {
      belongClient: "",
      clientid: "",
      clientTel: "",
      companyname: "",
      areaData: [],
      companyareadata: [],
      regaddress: "",
      regaddresscode: "",
      legalperson: "",
      levelvalue: "",
      levelcode: "",
      levelshow: false,
      companysrc: "",
      srccode: "",
      srcshow: false,
      trading: "",
      tradcode: "",
      tradingshow: false,
      taxtype: "",
      taxcode: "",
      taxshow: false,
      importlevelValue: [],
      customersourceValue: [],
      enterprisestatusValue: [],
      taxtypeValue: [],
      saveloading: false,
      nameflag: false
    };
  },
  components: {
    CustomerList,
    RegAddress,
    ImportLevel,
    CompanySrc,
    TradingStatus,
    TaxType
  },
  mounted() {
    this.GetDataAREA();
    this.getSelectOptions();
  },
  created() {
    let _self = this;
    _self.$Bus.off("UPDATA_CLIENT");
    _self.$Bus.on("UPDATA_CLIENT", e => {
      _self.belongClient = e.NAME;
      _self.clientTel = e.TEL;
      _self.clientid = e.ID;
    });
    // 注册地址
    _self.$Bus.off("UPDATE_REG_ADDRESS");
    _self.$Bus.on("UPDATE_REG_ADDRESS", e => {
      _self.regaddress = e[0].text + "/" + e[1].text;
      _self.regaddresscode = e[0].value + "-" + e[1].value;
    });
    // 重要等级
    _self.$Bus.off("UPDATA_IMPORT_LEVEL");
    _self.$Bus.on("UPDATA_IMPORT_LEVEL", e => {
      _self.levelvalue = e.text;
      _self.levelcode = e.value;
    });
    // 企业来源
    _self.$Bus.off("UPDATA_COMPANY_SRC");
    _self.$Bus.on("UPDATA_COMPANY_SRC", e => {
      _self.companysrc = e.text;
      _self.srccode = e.value;
    });
    // 交易状态
    _self.$Bus.off("UPDATA_TRADING_STATUS");
    _self.$Bus.on("UPDATA_TRADING_STATUS", e => {
      _self.trading = e.text;
      _self.tradcode = e.value;
    });
    // 企业纳税类型
    _self.$Bus.off("UPDATA_TAX_TYPE");
    _self.$Bus.on("UPDATA_TAX_TYPE", e => {
      _self.taxtype = e.text;
      _self.taxcode = e.value;
    });
  },
  methods: {
    openClientList() {
      this.$Bus.emit("OPEN_NAME_LIST", true);
    },
    companyNameCheck() {
      // 企业名称校验
      let _self = this;
      let re = /^[\u4e00-\u9fa5()（）]+$/;
      let value = _self.companyname;
      if (value == "" || value == null) {
        _self.$toast("企业名称不能为空");
        _self.nameflag = false;
      } else if (!re.test(value)) {
        _self.$toast("企业名称必须为汉字");
        _self.nameflag = false;
      } else {
        value = encodeURI(value);
        let url = "api/customer/findCompanyByName";
        let config = {
          params: {
            companyName: value
          }
        };
        function doSuccess(response) {
          console.log(response.data);
          if (response.data.data != null) {
            _self.$toast("抱歉，公司名重复");
            _self.nameflag = false;
          } else {
            _self.nameflag = true;
          }
        }
        _self.$Get(url, config, doSuccess);
      }
    },
    save() {
      let _self = this;
      _self.saveloading = true;
      if (!_self.belongClient) {
        _self.$toast("请输入归属客户");
        _self.saveloading = false;
      } else if (!_self.nameflag) {
        _self.$toast("请重新输入公司名称");
        _self.saveloading = false;
      } else if (
        _self.companyname &&
        _self.regaddress &&
        _self.legalperson &&
        _self.levelvalue &&
        _self.companysrc &&
        _self.trading &&
        _self.taxtype &&
        _self.nameflag &&
        _self.belongClient
      ) {
        let url = "/api/customer/saveCompany";
        const config = {
          companyname: _self.companyname,
          companyarea: _self.regaddresscode,
          legalrepresentative: _self.legalperson,
          importlevel: _self.levelcode,
          cluesource: _self.srccode,
          enterprisestatus: _self.tradcode,
          taxtype: _self.taxcode,
          customerid: _self.clientid
        };
        function success(res) {
          _self.belongClient = "";
          _self.clientTel = "";
          _self.companyname = "";
          _self.regaddress = "";
          _self.legalperson = "";
          _self.levelvalue = "";
          _self.companysrc = "";
          _self.trading = "";
          _self.taxtype = "";
          _self.$toast.success("添加成功！");
          _self.saveloading = false;
        }
        function fail(res) {
          _self.$toast.fail(res.data.msg);
          _self.saveloading = false;
        }
        _self.$Post(url, config, success, fail);
      } else {
        _self.$toast("请补全企业信息！");
        _self.saveloading = false;
      }
    },
    // 1
    openAdress() {
      this.$Bus.emit("OPEN_REG_ADDRESS", this.areaData);
    },
    // 2
    openLevel() {
      this.$Bus.emit("OPEN_IMPORT_LEVEL", this.importlevelValue);
    },
    // 3
    openSrc() {
      this.$Bus.emit("OPEN_COMPANY_SRC", this.customersourceValue);
    },
    // 4
    openTrading() {
      this.$Bus.emit("OPEN_TRADING_STATUS", this.enterprisestatusValue);
    },
    // 5
    openTax() {
      this.$Bus.emit("OPEN_TAX_TYPE", this.taxtypeValue);
    },
    GetDataAREA() {
      let _self = this;
      let params = "companyarea";
      function finish(res) {
        let temp = res.data.data.companyarea;
        for (let i = 0; i < res.data.data.companyarea.length; i++) {
          let com = {};
          com.value = res.data.data.companyarea[i].id;
          com.typecode = res.data.data.companyarea[i].typecode;
          com.text = res.data.data.companyarea[i].typename;
          com.children = [];
          for (
            let j = 0;
            j < res.data.data.companyarea[i].children.length;
            j++
          ) {
            let com_child = {};
            com_child.value = res.data.data.companyarea[i].children[j].id;
            com_child.typecode =
              res.data.data.companyarea[i].children[j].typecode;
            com_child.text = res.data.data.companyarea[i].children[j].typename;
            com.children.push(com_child);
          }
          _self.companyareadata.push(com);
        }
        _self.areaData = [
          {
            values: _self.companyareadata,
            className: "column1"
          },
          {
            values: _self.companyareadata[0].children,
            className: "column2",
            defaultIndex: 2
          }
        ];
      }

      this.$GetDataCenter(params, finish);
    },
    getSelectOptions() {
      let _self = this;
      let params =
        "cluesources,importlevel,enterprisestatus,taxtype,financialLevel";
      function finish(res) {
        let _cluesourceArr = res.data.data.cluesources;
        let _importlevelArr = res.data.data.importlevel;
        let _enterprisestatusArr = res.data.data.enterprisestatus;
        let _taxtypeArr = res.data.data.taxtype;

        _self.financialLevel = res.data.data.financialLevel;

        for (var i = 0; i < _cluesourceArr.length; i++) {
          var customersourceObj = {};

          customersourceObj.text = _cluesourceArr[i].typename;
          customersourceObj.value = _cluesourceArr[i].typecode;
          _self.customersourceValue.push(customersourceObj);
        }

        for (var i = 0; i < _importlevelArr.length; i++) {
          var customersourceObj = {};

          customersourceObj.text = _importlevelArr[i].typename;
          customersourceObj.value = _importlevelArr[i].typecode;
          _self.importlevelValue.push(customersourceObj);
        }

        // 下拉框-企业状态
        for (var i = 0; i < _enterprisestatusArr.length; i++) {
          var customersourceObj = {};

          customersourceObj.text = _enterprisestatusArr[i].typename;
          customersourceObj.value = _enterprisestatusArr[i].typecode;
          _self.enterprisestatusValue.push(customersourceObj);
        }

        // 下拉框-企业纳税类型
        for (var i = 0; i < _taxtypeArr.length; i++) {
          var customersourceObj = {};

          customersourceObj.text = _taxtypeArr[i].typename;
          customersourceObj.value = _taxtypeArr[i].typecode;
          _self.taxtypeValue.push(customersourceObj);
        }
      }
      this.$GetDataCenter(params, finish);
    }
  }
};
</script>
