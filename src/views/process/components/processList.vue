<template>
    <div class="pro-list">
      <ul class="clearfix">
        <router-link class="item" :to="item.url" tag="li" v-for="(item,index) in list" :key="index">
          <i class="el-icon-film"></i>{{item.name}}{{item.url}}
        </router-link>
      </ul>
    </div>
</template>
<script>
export default {
  data() {
    return {
      list: []
    }
  },
  mounted() {
    let menus = this.$store.state.menus.data
    // console.log(menus)
    menus.forEach(v1 => {
      v1.childMenu.forEach(v2=>{
        // console.log(v2.url)
        let obj = {}
        if('/' + v1.url == this.$route.path) {
          obj.url = v2.url
          obj.name = v2.name
          this.list.push(obj)
          console.log(this.list)
        }
      })
      
     
    });
    console.log(this.$route.path)
  },
  watch:{
    "$route.path":function(newVal) {
      
       
    }
  }
}
</script>
<style lang="scss" scoped>
  .pro-list {
    .item {
      border: 1px #eee solid;
      margin-bottom: 10px;
      padding: 0 10px;
      line-height: 50px;
      font-size: 16px;
      cursor: pointer;
      i {
        font-size: 18px;
        margin-right: 10px;
        color: rgb(228, 114, 13);
      }
    }
  }
</style>