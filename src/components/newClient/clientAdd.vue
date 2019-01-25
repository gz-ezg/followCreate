<template>
  <van-row style="overflow-x: hidden">
    <van-nav-bar title="录入客户信息" style="background-color:#CC3300;color:white" />
    <van-row>
      <div style="width:80%;margin:auto">
        <van-cell-group>
          <van-field v-model="username" label="姓名" placeholder="请输入姓名" />
          <van-field v-model="usertel" label="电话" placeholder="请输入电话" @blur="telCheck" />
          <van-cell title="客户来源" is-link v-model="usersource" @click="openSrc()" />
          <van-cell title="区域" is-link v-model="userarea" @click="openArea()" />
          <van-cell title="客户等级" is-link v-model="userlevel" @click="openLevel()" />
          <van-cell title="客户状态" is-link v-model="usertype" @click="openType()" />
          <client-source></client-source>
          <area-select></area-select>
          <client-level></client-level>
          <client-type></client-type>

        </van-cell-group>
      </div>
      <van-tabbar style="margin-top:30px;">
        <van-button type="primary" bottom-action :loading="saveloading" style="font-size:20px;border-radius:5px;background-color:#CC3300"
          @click="save">保存</van-button>
      </van-tabbar>
    </van-row>

  </van-row>
</template>

<script>
import ClientSource from "../common/clientSource";
import AreaSelect from "../common/areaSelect";
import ClientLevel from "../common/clientLevel";
import ClientType from "../common/clientType";
export default {
  data() {
    return {
      username: "",
      usertel: "",
      usersource: "",
      userarea: "",
      userlevel: "",
      usertype: "",
      clientlist: [],
      arealist: [],
      levellist: [],
      customerType: [],
      customerTypeArr: [],
      typeList: [],
      sourcecode: "",
      areacode: "",
      levelcode: "",
      typecode: "",
      saveloading: false,
      telflag: false
    };
  },
  components: {
    ClientSource,
    AreaSelect,
    ClientLevel,
    ClientType
  },
  created() {
    let _self = this;
    _self.getDataCenter();
    // 1
    _self.$Bus.off("UPDATA_CLIENT_SRC");
    _self.$Bus.on("UPDATA_CLIENT_SRC", e => {
      _self.usersource = e.typename;
      _self.sourcecode = e.typecode;
    });
    // 2
    _self.$Bus.off("UPDATA_AREA");
    _self.$Bus.on("UPDATA_AREA", e => {
      _self.userarea = e.typename;
      _self.areacode = e.typecode;
    });
    // 3
    _self.$Bus.off("UPDATA_LEVEL");
    _self.$Bus.on("UPDATA_LEVEL", e => {
      _self.userlevel = e.typename;
      _self.levelcode = e.typecode;
    });
    // 4
    _self.$Bus.off("UPDATE_CLIENT_TYPE");
    _self.$Bus.on("UPDATE_CLIENT_TYPE", e => {
      _self.usertype = e[0].text + "/" + e[1].text;
      _self.typecode = e[0].value + "-" + e[1].value;
    });
  },
  methods: {
    // 1
    openSrc() {
      let _self = this;
      let temp = _self.clientlist;
      temp.forEach(element => {
        element.text = element.typename;
      });
      _self.clientlist = temp;
      _self.$Bus.emit("OPEN_CLIENT_SRC", _self.clientlist);
    },
    // 2
    openArea() {
      let _self = this;
      let temp = _self.arealist;
      temp.forEach(element => {
        element.text = element.typename;
      });
      _self.arealist = temp;
      _self.$Bus.emit("OPEN_AREA", _self.arealist);
    },
    // 3
    openLevel() {
      let _self = this;
      let temp = _self.levellist;
      temp.forEach(element => {
        element.text = element.typename;
      });
      _self.levellist = temp;
      _self.$Bus.emit("OPEN_CLIENT_LEVEL", _self.levellist);
    },
    // 4
    openType() {
      this.$Bus.emit("OPEN_CLIENT_TYPE", this.typeList);
    },
    telCheck() {
      let _self = this;
      let value = this.usertel;
      let re = /^1\d{10}$/;
      if (value == "" || value == null) {
        _self.telflag = false;
      } else {
        if (re.test(value)) {
          let url = "api/customer/findCustomerByTel";
          let config = {
            params: {
              tel: value
            }
          };
          function doSuccess(response) {
            if (response.data.data != null) {
              _self.$toast("抱歉，电话号码重复");
              _self.telflag = false;
            } else {
              _self.telflag = true;
            }
          }
          _self.$Get(url, config, doSuccess);

        } else {
          _self.$toast("电话格式不正确");
          _self.telflag = false;
        }
      }
    },
    save() {
      let _self = this;
      _self.saveloading = true;
      if (!_self.telflag) {
        _self.$toast("请重新输入电话");
        _self.saveloading = false;
      } else if (
        _self.username &&
        _self.usertel &&
        _self.usersource &&
        _self.userarea &&
        _self.userlevel &&
        _self.usertype &&
        _self.telflag
      ) {
        let url = "api/customer/saveCustomer";
        const config = {
          name: _self.username,
          tel: _self.usertel,
          customersource: _self.sourcecode,
          area: _self.areacode,
          importlevel: _self.levelcode,
          customertype: _self.typecode,
          address: "",
          backup: "",
          issend: "",
          fixedphone: "",
          qq: "",
          weixin: "",
          email: "",
          sourcesubdivision: "",
          channelTypeId: "",
          recCustomer: ""
        };
        function success(res) {
          _self.username = "";
          _self.usertel = "";
          _self.usersource = "";
          _self.userarea = "";
          _self.userlevel = "";
          _self.usertype = "";
          _self.$toast.success("添加成功！");
          _self.saveloading = false;
        }
        function fail(res) {
          _self.$toast.fail("添加失败！");
          _self.saveloading = false;
        }
        _self.$Post(url, config, success, fail);
      } else {
        _self.$toast("请补全客户信息！");
        _self.saveloading = false;
      }
    },
    getDataCenter() {
      var _self = this;
      let params = "customerTypes,cluesources,customerrating,area,sf_yn";
      function finish(res) {
        var temp = res.data.data;
        _self.arealist = temp.area;
        _self.clientlist = temp.cluesources;
        _self.customerType = temp.customerTypes;
        _self.levellist = temp.customerrating;
        _self.sf_yn = temp.sf_yn;
        // _self.area.reverse();
        // let temp2 = _self.$changeCars(_self.customerType);

        // 二级联动改一级
        _self.customerTypeArr = [];
        for (let i = 0; i < _self.customerType.length; i++) {
          var temp = {};
          if (_self.customerType[i].children != null) {
            for (let j = 0; j < _self.customerType[i].children.length; j++) {
              temp = {};
              temp.id = _self.customerType[i].children[j].id;
              temp.typecode = _self.customerType[i].children[j].typecode;
              temp.typename = _self.customerType[i].children[j].typename;
              temp.pid = _self.customerType[i].children[j].pid;
              temp.ptypename = _self.customerType[i].typename;
              temp.ptypecode = _self.customerType[i].typecode;
              _self.customerTypeArr.push(temp);
            }
          } else {
            temp = {};
            temp.id = _self.customerType[i].id;
            temp.typecode = _self.customerType[i].typecode;
            temp.ptypename = _self.customerType[i].typename;
            temp.typename = "";
            temp.pid = 0;
            _self.customerTypeArr.push(temp);
          }

          //  修改成规定的模型
          _self.customerType[i].value = _self.customerType[i].id;
          _self.customerType[i].text = _self.customerType[i].typename;

          if (_self.customerType[i].children != null) {
            for (let j = 0; j < _self.customerType[i].children.length; j++) {
              _self.customerType[i].children[j].value =
                _self.customerType[i].children[j].id;
              // _self.customerType[i].children[j].label =
              //   _self.customerType[i].children[j].typename;
              _self.customerType[i].children[j].text =
                _self.customerType[i].children[j].typename;
            }
          }
          _self.typeList = [
            {
              values: _self.customerType,
              className: "column1"
            },
            {
              values: _self.customerType[0].children,
              className: "column2",
              defaultIndex: 2
            }
          ];
        }
      }
      _self.$GetDataCenter(params, finish);
    }
  }
};
</script>
