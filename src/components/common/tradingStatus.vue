<template>
  <div>
    <van-popup v-model="areaShow" position="bottom">
      <van-picker
        show-toolbar
        title="交易状态"
        :columns="columns"
        @cancel="onCancel"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      areaShow: false,
      columns: []
    };
  },
  methods: {
    onConfirm(e) {
      this.areaShow = false;
      this.$Bus.emit("UPDATA_TRADING_STATUS", e);
    },
    onCancel() {
      this.areaShow = false;
    }
  },
  created() {
    let _self = this;
    _self.$Bus.off("OPEN_TRADING_STATUS");
    _self.$Bus.on("OPEN_TRADING_STATUS", e => {
      _self.areaShow = true;
      _self.columns = e;
    });
  }
};
</script>