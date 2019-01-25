<template>
    <van-dialog
        v-model="type_open"
        :show-confirm-button="false"
        :close-on-click-overlay="true"
        >
        <van-radio-group v-model="select_type_id">
            <van-cell-group>
                <van-cell v-for="item in followTypeText" :key="item.id" clickable @click="choose(item)">
                    <van-col span="22"><div>{{item.typename}}</div></van-col>
                    <van-col span="2"><van-radio :name="item.typecode" /></van-col>
                </van-cell>
            </van-cell-group>
        </van-radio-group>
    </van-dialog>
</template>

<script>
export default {
  props: ["followTypeText"],
  data() {
    return {
      type_open: false,
      select_type_id: ""
    };
  },
  methods: {
    choose(e) {
      console.log(e);
      let _self = this;
      _self.select_type_id = e.typecode;
      _self.$Bus.emit("UPDATA_TYPE", e);
      _self.type_open = false;
    }
  },
  created() {
    let _self = this;
    _self.$Bus.off("OPEN_TYPE_LIST");
    _self.$Bus.on("OPEN_TYPE_LIST", e => {
      _self.type_open = true;
    });
  }
};
</script>

