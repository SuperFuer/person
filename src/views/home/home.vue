<template>
    <div>
      <div class="form-title"><i class="icon"></i>最近查看</div>
      <!-- 最近查看 -->
      <div class="pro-list">
        <ul class="clearfix">
          <li class="list" v-for="(item,index) in seeData" :key="index">
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
              <p class="text" @click="seeSave(index, item.apiUrl, item.name, item.coll)">
                <i class="coll-icon iconfont" :class="item.coll == '0' ? 'icon-shoucang' : item.coll == '1' ? 'icon-shoucang1' : 'icon-shoucang'" ></i>
                {{item.coll == '0' ? '收藏' : item.coll == '1' ? '已收藏' : '收藏'}}
              </p>
            </div>
          </li>
        </ul>
      </div>
      <div class="form-title"><i class="icon"></i>我的收藏</div>
      <!-- 我的收藏 -->
      <div class="pro-list">
        <ul class="clearfix">
          <li class="list" v-for="(item,index) in collData" :key="index">
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
    </div>
</template>
<script>
import { axiosPost, axiosGet } from '@/api/index.js'
export default {
  data() {
    return {
      formInline: { // 搜索内容
        user: '',
        region: '',
        state: ''
      },
      size: 5,
      seeData: [],
      collData: [],
      coll: '1' // 收藏状态 0未收藏 1已收藏
    }
  },
  created () {
    this.dataList(this.size)
  },
  methods: {
    // 查看收藏
    seeSave (index, url, name, coll) {
      let that = this
      if (!coll) {
        axiosPost('base/userCollect/addOrCancel', {
          name: name,
          apiUrl: url
        }).then(res => {
          if (res.code === 200) {
            // this.$message('收藏成功！')
            that.$set(that.seeData[index], 'coll', '1')
            that.dataList(that.size)
          }
        })
      } else if (coll === '1') {
        axiosPost('base/userCollect/addOrCancel', {
          name: name,
          apiUrl: url
        }).then(res => {
          if (res.code === 200) {
            // this.$message('取消收藏！')
            that.$set(that.seeData[index], 'coll', '0')
            that.dataList(that.size)
          }
        })
      } else if (coll === '0') {
        axiosPost('base/userCollect/addOrCancel', {
          name: name,
          apiUrl: url
        }).then(res => {
          if (res.code === 200) {
            // this.$message('收藏成功！')
            that.$set(that.seeData[index], 'coll', '1')
            that.dataList(that.size)
          }
        })
      }
      // console.log(this.list)
    },
    callSave (index, url, name, coll) {
      let that = this
      if (coll === '1') {
        axiosPost('base/userCollect/addOrCancel', {
          name: name,
          apiUrl: url
        }).then(res => {
          if (res.code === 200) {
            this.$message('取消收藏！')
            that.$set(that.collData[index], 'coll', '0')
            that.collData.splice(index, 1)
          }
        })
      } else if (coll === '0') {
        axiosPost('base/userCollect/addOrCancel', {
          name: name,
          apiUrl: url
        }).then(res => {
          if (res.code === 200) {
            this.$message('收藏成功！')
            that.$set(that.collData[index], 'coll', '1')
            that.collData.splice(index, 1)
          }
        })
      }
      // console.log(this.list)
    },
    // 获取查看和收藏列表
    dataList (size) {
      axiosGet('base/api/getViewCollect?size=' + size).then(res => {
        if (res.code === 200) {
          let that = this
          that.seeData = res.data.viewList
          that.collData = res.data.collectList
          if (this.collData) {
            that.collData.forEach((item, index) => {
              that.$set(item, 'coll', '1')
              that.collData.splice(index, 1, item)
              // localStorage.setItem('collData', JSON.stringify(that.collData))
            })
          }
          if (that.seeData) {
            that.seeData.forEach((item, index) => {
              if (that.collData) {
                that.collData.forEach(val => {
                  if (item.name === val.name) {
                    that.$set(item, 'coll', '1')
                    that.seeData.splice(index, 1, item)
                  } else {
                    // that.$set(item, 'coll', '0')
                  }
                })
              }
            })
          }
          console.log(that.seeData)
        }
      })
    }
  }
}
</script>
<style lang="scss">
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
