<template>
  <div class="process">
    <div class="form-title"><i class="icon"></i>应用中心</div>
    <div class="proapp-list">
      <ul class="clearfix">
        <router-link class="item" :to="item.apiUrl" tag="li" v-for="(item,index) in list" :key="index">
          <div class="box" style="box-shadow:4px 4px 10px #3AA6FF;">
            <i class="iconfont" :class="item.cssClass"></i>
            <div class="moright">
              {{item.name}}
            </div>
          </div>
        </router-link>
      </ul>
      <router-view></router-view>
    </div>
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
    // console.log(menus)
    menus.forEach(v1 => {
      v1.childMenu.forEach(v2=>{
        let obj = {}
        if('/' + v1.apiUrl == this.$route.path) {
          obj.apiUrl = v2.apiUrl
          obj.name = v2.name
          obj.cssClass = v2.cssClass
          this.list.push(obj)
        }
      })
    });
  },
  watch:{
    "$route.path":function(newVal) {
      let menus = this.$store.state.menus.data
      menus.forEach(v1 => {
        v1.childMenu.forEach(v2=>{
          let obj = {}
          if('/' + v1.apiUrl == this.$route.path) {
            obj.apiUrl = v2.apiUrl
            obj.name = v2.name
            this.list.push(obj)
          }
        })
      });
    }
  }
}
</script>
<style lang="scss" scoped>
  .process {
    height: 100%;
    background: url(../../assets/images/process-bg.png) no-repeat bottom;
    background-size: 100%;
    .proapp-list {
      ul {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        flex-direction: row;
        flex-wrap: wrap;
      }
      .item {
        width: 25%;
        box-sizing: border-box;
        padding: 10px;
        /*height: 130px;*/
        /*margin-bottom: 30px;*/
        color: #fff;
        font-size: 16px;
        transition: All 0.2s ease-in-out;
        cursor: pointer;
        &:hover{
          /* transform: scale(1.04);  */
        }
        .box {
          background: #F79021;
          // width: 100%;
          /*height: 100%;*/
          height: 50px;
          padding: 15px 20px;
          display: flex;
          align-items: center;
          i {
            border: 2px #fff solid;
            padding: 7px;
            border-radius: 50%;
            font-size: 16px;
            margin-right: 15px;
            text-align: center;
            color: #fff;
            width: 25px;
            height: 25px;
            line-height: 25px;
          }
          .moright {
            p {
              line-height: 5px;
              margin-bottom: 20px;
            }
          }
        }
      }
      .item:nth-of-type(2) .box {
        background: #FF6158;
      }
      .item:nth-of-type(3) .box {
        background: #2FCE6A;
      }
      .item:nth-of-type(4) .box {
        background: #19ADFF;
      }
    }
  }
</style>
