<template>
  <div class="pro-list">
    <ul class="clearfix">
      <li class="list" v-for="(item,index) in list" :key="index"  @click="seeSave(item.name, item.apiUrl)">
        <div class="box">
          <router-link :to="item.apiUrl">
            <div class="topCon">
              <p class="iconSub">
                <span class="icon">
                  <i class="iconfont icon-baofeishebei"></i>
                </span>
              </p>
              <p class="name">{{item.name}}</p>
            </div>
          </router-link>
          <p class="text" @click="callSave(index, item.apiUrl, item.name, item.coll)">
            <i class="coll-icon iconfont" :class="item.coll == '0' ? 'icon-shoucang' : item.coll == '1' ? 'icon-shoucang1' : 'icon-shoucang'" ></i>
            {{item.coll == '0' ? '收藏' : item.coll == '1' ? '已收藏' : '收藏'}}
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { axiosPost, axiosGet } from '@/api/index.js'
export default {
  data () {
    return {
      list: [],
      collList: [],
      coll: '0' // 收藏状态 0未收藏 1已收藏
    }
  },
  created () {
    // 获取菜单列表
    let menus = this.$store.state.menus.data
    menus.forEach(v1 => {
      v1.childMenu.forEach(v2 => {
        if ('/' + v2.apiUrl === this.$route.path) {
          this.list = v2.childMenu
        }
      })
    })
    this.callList()
  },
  methods: {
    // 收藏
    callSave (index, url, name, coll) {
      let that = this
      if (!coll) {
        axiosPost('base/userCollect/addOrCancel', {
          name: name,
          apiUrl: url
        }).then(res => {
          if (res.code === 200) {
            // this.$message('收藏成功！')
            that.$set(that.list[index], 'coll', '1')
          }
        })
      } else if (coll === '1') {
        axiosPost('base/userCollect/addOrCancel', {
          name: name,
          apiUrl: url
        }).then(res => {
          if (res.code === 200) {
            // this.$message('取消收藏！')
            that.$set(that.list[index], 'coll', '0')
          }
        })
      } else if (coll === '0') {
        axiosPost('base/userCollect/addOrCancel', {
          name: name,
          apiUrl: url
        }).then(res => {
          if (res.code === 200) {
            // this.$message('收藏成功！')
            that.$set(that.list[index], 'coll', '1')
          }
        })
      }
      console.log(this.list)
    },
    // 查看--保存
    seeSave (name, url) {
      // console.log(name, url)
      axiosPost('base/userView/add', {
        name: name,
        apiUrl: url
      }).then(res => {
        console.log(res)
      })
    },
    // 获取收藏列表
    callList () {
      let that = this
      axiosGet('base/api/getViewCollect?size=' + 20).then(res => {
        if (res.code === 200) {
          that.collList = res.data.collectList
        }
        console.log(that.collList)
        that.list.forEach((item, index) => {
          if (this.collList) {
            that.collList.forEach(val => {
              // that.$set(item, 'coll', '0')
              if (item.name === val.name) {
                that.$set(item, 'coll', '1')
                that.list.splice(index, 1, item)
              }
            })
          }
        })
        // console.log(that.list)
        // that.$set(item, 'coll', '1')
        // that.list.splice(index, 1, item)
      })
    }
  },
  watch: {
    '$route.path': function (newVal) {
      let menus = this.$store.state.menus.data
      menus.forEach(v1 => {
        v1.childMenu.forEach(v2 => {
          if ('/' + v2.apiUrl === this.$route.path) {
            this.list = v2.childMenu
          }
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .pro-list {
    ul {
      display: flex;
      justify-content: flex-start;
      flex-direction: row;
      flex-wrap: wrap;
    }
    .list {
      width: 20%;
      font-size: 16px;
      padding: 15px;
      box-sizing: border-box;
      cursor: pointer;
      .box {
        background: #FBEEEA;
        border: 1px #ccc solid;
        border-radius: 5px;
        height: 200px;
        text-align: center;
        .topCon {
          background: #fff;
          height: 116px;
          border-radius: 5px;
          padding: 20px;
          .iconSub {
            line-height: 50px;
            margin-bottom: 15px;
            .icon {
              background: #004EA2;
              width: 50px;
              height: 50px;
              border-radius: 50%;
              display: inline-block;
              color: #fff;
              .iconfont {
                font-size: 24px;
              }
            }
          }
          .name {
            line-height: 25px;
          }
        }
        .text {
          background: #FBEEEA;
          height: 44px;
          text-align: center;
          line-height: 44px;
          color: #CA0000;
          border-radius: 5px;
        }
      }
    }
    .list:nth-of-type(2n) {
      .topCon {
        .iconSub {
          .icon {
            background: #2FCE6A;
          }
        }
      }
    }
    .list:nth-of-type(3n) {
      .topCon {
        .iconSub {
          .icon {
            background: #EE5050;
          }
        }
      }
    }
    .list:nth-of-type(4n) {
      .topCon {
        .iconSub {
          .icon {
            background: #DB9E5E;
          }
        }
      }
    }
  }
</style>
