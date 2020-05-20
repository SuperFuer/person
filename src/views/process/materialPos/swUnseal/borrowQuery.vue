<template>
  <div>
    <!-- 借用（内部门）新增查询 -->
    <!-- <bmjyQuery :paramList="params"></bmjyQuery> -->
  </div>
</template>
<script>
// import bmjyQuery from "@/views/components/bmjyQuery"
export default {
  data(){
    return{
        params: "",
        currentType: 0,
        type: ''
    }
  },
    components:{
      // bmjyQuery: bmjyQuery
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
