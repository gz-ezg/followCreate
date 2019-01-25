<template>
  <div>
    <van-popup v-model="typeShow" position="bottom">
      <van-picker
        show-toolbar
        title="客户状态"
        :columns="columns"
        @cancel="cancel_type"
        @confirm="confirm_type"
        @change="on_change"
      />
    </van-popup>
  </div>
</template>


<script>
export default {
  data() {
    return {
      typeShow: false,
      columns: []
    };
  },
  methods: {
    on_change(picker, values) {
      picker.setColumnValues(1, values[0].children);
    },
    confirm_type(e) {
      this.$Bus.emit("UPDATE_CLIENT_TYPE", e);
      this.typeShow = false;
    },
    cancel_type() {
      this.typeShow = false;
    }
  },
  created() {
    let _self = this;
    _self.$Bus.off("OPEN_CLIENT_TYPE");
    _self.$Bus.on("OPEN_CLIENT_TYPE", e => {
      _self.typeShow = true;
      _self.columns = e;
    });
  }
};
</script>