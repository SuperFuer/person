<template>
  <div>
    <!-- 借用（内部门）新增查询 -->
    <!-- <bmjyQuery v-if="currentType == 3" :paramList="params"></bmjyQuery> -->
    <!-- 归还（内部门）新增查询 -->
    <bmghQuery v-if="currentType == 4" :paramList="params"></bmghQuery>
  </div>
</template>
<script>
// import bmjyQuery from "@/views/components/bmjyQuery"
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
      // bmjyQuery: bmjyQuery,
      bmghQuery: bmghQuery
    },
    created(){
      var _this=this;
      _this.params=this.$route.query;
      console.log( _this.params);
      // 如果类型为0 进入验收草稿或历史
      _this.currentType=_this.params.applicationType;
      _this.type=_this.params.type;
    }
}
</script>
<style lang="">

</style>
