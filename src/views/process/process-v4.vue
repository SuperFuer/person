<template>
    <div class="pro-list">
      <ul class="clearfix">
        <router-link class="list" :to="item.url" tag="li" v-for="(item,index) in list" :key="index">
          <i class="el-icon-film"></i>{{item.name}}
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
  created() {
    let menus = this.$store.state.menus.data
    menus.forEach(v1 => {
      v1.childMenu.forEach(v2 => {
        v2.childMenu.forEach(v3 => {
          // console.log(v3.name)
          if('/' + v3.url == this.$route.path) {
            this.list = v3.childMenu
          }
        })
      })
    })
    console.log(this.$route.path)
  },
  watch: {
    '$route.path':function(newVal) {
      let menus = this.$store.state.menus.data
      menus.forEach(v1 => {
        v1.childMenu.forEach(v2 => {
          v2.childMenu.forEach(v3 => {
            // console.log(v3.name)
            if('/' + v3.url == this.$route.path) {
              this.list = v3.childMenu
            }
          })
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .pro-list {
    .list {
      width: 42%;
      float: left;
      margin-bottom: 10px;
      padding: 0 4%;
      line-height: 50px;
      font-size: 16px;
      cursor: pointer;
      i {
        font-size: 18px;
        margin-right: 10px;
        color: rgb(228, 114, 13);
      }
      .coll-icon {
        float: right;
      }
    }
  }
</style>
