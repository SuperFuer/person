<template>
  <div>
    <!-- 借用（内部门）新增查询 -->
    <bmghQuery :paramList="params"></bmghQuery>
  </div>
</template>
<script>
import bmghQuery from "@/views/components/bmghQuery"
export default {
  data(){
    return{
        params: "",
        currentType: 0,
        type: ''
    }
  },
    components:{
      bmghQuery: bmghQuery
    },
    created(){
      var _this=this;
      _this.params=this.$route.query;
      console.log( _this.params);
      // 如果有type表示是从草稿页进入
      _this.currentType=_this.params.applicationType;
      _this.type=_this.params.type;
    }
}
</script>
<style lang="">

</style>
