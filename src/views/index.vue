<template>
  <div class="home">
    <el-container>
      <el-header height="80px">
        <!-- 头部 组件-->
        <header-top v-if="isNew"></header-top>
      </el-header>
      <el-container>
        <!-- 左侧菜单 组件-->
        <!-- <aside-menu></aside-menu> -->
        <!-- 右侧内容 组件-->
        <el-main id="scaleing">
          <!-- 面包屑 组件-->
          <jsadmin></jsadmin>
          
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
// import { getmenus } from '@/api/index.js'
import aside from "@/components/aside.vue";
import header from "@/components/header.vue";
import jsadmin from "@/views/jurisdiction/qxset/jsadmin.vue";
export default {
  data() {
    return {
      menuList: [],
      crumb: "",
      arrCrumb: [],
      isNew: true
    };
  },
  components: {
    "aside-menu": aside,
    "header-top": header,
    jsadmin: jsadmin
  },
  methods: {
    isNoYesLoad: function (){
      this.isNew = false;
      this.$nextTick(() => {         // 重新获取审批历史组件 => 做到实时刷新
        this.isNew = true;
      });
    },
    // openAside() {}
    //   leftmenus(){
    //       getmenus().then(result => {
    //         // console.log(result)
    //         this.menuList = result.data.data
    //         // result.data.data.forEach(item => {
    //         //     console.log(item.path)
    //         //     item.children.forEach(v => {
    //         //         console.log(v.path)
    //         //     })
    //         // });
    //       })
    //   }
  },
  created () {
    //this.isNoYesLoad()
  }
};
</script>
<style lang="scss" scoped>
.home {
  .el-input__inner {
    height: 30px !important;
    line-height: 30px !important;
  }
  height: 100%;
  background: linear-gradient(
    #004ea2 0%,
    #004ea2 20%,
    #edf2f8 20%,
    #edf2f8 100%
  );
  .el-main {
    // margin: 0 30px 80px 0;
	padding: 20px 15px;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .main-view {
      margin: 20px;
      height: 100%;
    }
  }
  .el-header {
    background: #3b93ec;
    padding: 0;
    overflow: hidden;
    color: #fff;
  }
  .el-container {
    height: 100%;
  }
  .el-aside {
    background: #eef1f6;
  }
  .menu {
    .title {
      height: 40px;
      line-height: 40px;
      padding: 0 10px;
      background: #d7ddeb;
    }
    li {
      height: 40px;
      line-height: 40px;
      padding: 0 10px;
    }
  }
  .el-row {
    position: relative;
  }
  #scaleing {
    overflow-x: hidden!important;
  }
}
</style>
