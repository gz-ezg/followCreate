<template>
    <van-row style="overflow-x: hidden">
      <!-- <van-notice-bar
        text="如在使用过程遇到问题或者有需要改进的地方，请及时联系技术部！"
      /> -->
        <van-row>
            <div style="height: 150px;margin-top: 7rem">
                <center>
                    <img style="height: 80px" src="./logo.png"/>
                </center>
            </div>
            <div style="width:80%;margin:auto">
                <van-cell-group>
                        <van-field
                            v-model="username"
                            label="用户名"
                            placeholder="请输入用户名"
                        />
                        <van-field
                            v-model="password"
                            type="password"
                            label="密码"
                            placeholder="请输入密码"
                        />
                </van-cell-group>
            </div>
            <van-row style="width:80%;margin:auto;margin-top:60px">
                <van-button size="large" type="primary" @click="before_login" :loading="loading">登 陆</van-button>
            </van-row>
        </van-row>
    </van-row>
</template>

<script>
import Cookies from "js-cookie";

export default {
  data() {
    return {
      username: "",
      password: "",
      loading:false,
    };
  },
  methods: {
    before_login(){
      if(this.username == "" || this.password == ""){
        this.$toast.fail("请输入账号密码！")
      }else{
        this.login()
      }
    },
    login() {
      let _self = this;
      _self.loading = true
      let url = `api/user/login`;
      let config = {
        username: _self.username,
        password: _self.password
      };

      function success(res) {
        Cookies.set("user", _self.username);
        Cookies.set("password", _self.password);
        localStorage.setItem("realname", res.data.data.user.realname);
        let userId = res.data.data.user.id;
        _self.loading = false
        _self.getUserRole(userId);
      }

      function fail(res) {
        _self.$toast.fail(res.data.msg);
        _self.loading = false
      }
      _self.$Post(url, config, success, fail);
    },

    getUserRole(e) {
      let _self = this;
      let url = "/api/user/checkUserRoleByUserId";
      let config = {
        params: {
          userId: e
        }
      };
      function success(res) {
        let temp = [];
        for (let i = 0; i < res.data.data.length; i++) {
          temp.push(res.data.data[i].rolecode);
        }
        for (let j = 0; j < temp.length; j++) {
          if (temp[j] == "salers") {
            localStorage.setItem("Main_Role", "salers");
            break;
          } else if (temp[j] == "kj" || temp[j] == "kjbgd") {
            localStorage.setItem("Main_Role", "kuaiji");
            break;
          } else if (temp[j] == "servicer" || temp[j] == "ssbgd") {
            localStorage.setItem("Main_Role", "shangshi");
            break;
          } else if (temp[j] == "planner" || temp[j] == "qhbgd") {
            localStorage.setItem("Main_Role", "qihua");
            break;
          } else if (temp[j] == "auditing" || temp[j] == "sjbgd") {
            localStorage.setItem("Main_Role", "shenji");
            break;
          } else if (j == temp.length - 1) {
            localStorage.setItem("Main_Role", "other");
          }
        }
        let str = JSON.stringify(temp);
        localStorage.setItem("Role", str);
        let userrole = localStorage.getItem("Main_Role");
        _self.$toast.success("登陆成功！")
        _self.$router.push({
          name: "clientRecord",
          params: {
            id: e
          }
        });
      }
      _self.$Get(url, config, success);
    },
    // 自动登录
    autologin(code) {
      let _self = this;
      let url = `api/legwork/apiLoginByWechatCode`;
      let formdata = new FormData();
      formdata.append("agentId", "1000030");
      formdata.append("code", code);

      _self.$http.post(url, formdata).then(function(res) {
          if (res.data.msgCode == 40000) {
            localStorage.setItem("realname", res.data.data.user.realname);
            localStorage.setItem("id", res.data.data.user.id);
            // _self.getRole(localStorage.getItem("id"));
            _self.getUserRole(res.data.data.user.id)
          } else {
            _self.$toast.fail("免登陆失败！请登陆！");
          }
        })
        .catch(function(err) {
          _self.$toast.fail("免登陆失效，请登录！");
        });
    },
    loading_function() {
      let _self = this;
      let str = location.href;
      let temp = str.split("?");
      let temp2 = str.split("&");
      let params = temp2[0].split("=");
      // console.log(params)
      if (params[1] == "null") {
        _self.$toast.fail("免登陆失效，请登录！");
      } else {
        console.log(params[1]);
        _self.autologin(params[1]);
      }
    }
  },
  created(){
    let _self = this
    // this.autologin()
    _self.loading_function();
  }
};
</script>
