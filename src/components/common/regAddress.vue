<template>
  <div>
    <van-popup v-model="typeShow" position="bottom">
      <van-picker
        show-toolbar
        title="公司注册地"
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
      this.$Bus.emit("UPDATE_REG_ADDRESS", e);
      this.typeShow = false;
    },
    cancel_type() {
      this.typeShow = false;
    }
  },
  created() {
    let _self = this;
    _self.$Bus.off("OPEN_REG_ADDRESS");
    _self.$Bus.on("OPEN_REG_ADDRESS", e => {
      _self.typeShow = true;
      _self.columns = e;
    });
  },
  mounted() {}
};
</script>