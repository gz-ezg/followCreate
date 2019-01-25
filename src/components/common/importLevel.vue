<template>
  <div>
    <van-popup v-model="areaShow" position="bottom">
      <van-picker
        show-toolbar
        title="重要等级"
        :columns="columns"
        @cancel="onCancel"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
export default {
  data(){
    return{
      areaShow:false,
      columns: [],
    }
  },
  methods:{
    onConfirm(e){
      this.areaShow = false;
      this.$Bus.emit('UPDATA_IMPORT_LEVEL',e);
    },
    onCancel(){
      this.areaShow = false;
    }
  },
  created(){
    let _self = this;
    _self.$Bus.off('OPEN_IMPORT_LEVEL');
    _self.$Bus.on('OPEN_IMPORT_LEVEL',(e)=>{
      _self.areaShow = true;
      _self.columns = e;
    })
  }
}
</script>