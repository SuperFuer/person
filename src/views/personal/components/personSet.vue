<template>
  <div class="personal">
    <div class="form-title">
      <i class="icon"></i>个人信息
    </div>
    <el-row>
      <el-col :span="7" class="person-icon">
        <div>
          <div style="color:#333;" class="set-icon">
            <i class="el-icon-user-solid" style="font-size:70px;color:#999"></i>
          </div>
          <ul>
            <li>{{tableData.name}}</li>
            <li>账号： {{tableData.usrId | upper |isNull}}</li>
            <li>部门： {{tableData.deptName | isNull}}</li>
          </ul>
        </div>
      </el-col>
      <el-col :span="17">
        <div class="personal-info">
          <ul class="clearfix">
            <li>
              <div class="til">
                <i class="iconfont icon-xingming1"></i>姓名
              </div>
              <div class="tir">{{tableData.name}}</div>
            </li>
            <li>
              <div class="til">
                <i class="iconfont icon-zhanghaoxinxi-xiugai"></i>账号
              </div>
              <div class="tir">{{tableData.usrId | upper}}</div>
            </li>
            <li>
              <div class="til">
                <i class="iconfont icon-youxiang"></i>邮箱
              </div>
              <div class="tir">{{tableData.mail}}</div>
            </li>
            <li>
              <div class="til">
                <i class="iconfont icon-xingming"></i>电话
              </div>
              <div class="tir">{{tableData.mobile| isNull}}</div>
            </li>
            <li>
              <div class="til">
                <i class="iconfont icon-zuoxixingming"></i>名下设备数
              </div>
              <div class="tir">
                {{deviceLength}}
                <span class="goSee" @click="goSee('0')">去查看</span>
              </div>
            </li>
            <li>
              <div class="til">
                <i class="iconfont icon-phone"></i>所管理设备数
              </div>
              <div class="tir" v-if="tableData.sbgly=='1'">
                {{deviceNum}}
                <span class="goSee" @click="goSee('1')">去看看</span>
              </div>
              <div class="tir" v-else>0</div>
            </li>
          </ul>
        </div>
      </el-col>
    </el-row>
    <div class="form-title">
      <i class="icon"></i>功能收藏设置
    </div>
    <div class="pro-list">
      <ul class="clearfix">
        <li
          class="list"
          v-for="(item,index) in list"
          :key="index"
          @click="seeSave(item.name, item.apiUrl)"
        >
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
              <i
                class="coll-icon iconfont"
                :class="item.coll == '0' ? 'icon-shoucang' : item.coll == '1' ? 'icon-shoucang1' : 'icon-shoucang'"
              ></i>
              {{item.coll == '0' ? '收藏' : item.coll == '1' ? '已收藏' : '收藏'}}
            </p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { axiosPost, axiosGet } from "@/api/index.js";
export default {
  data() {
    return {
      tableData: {},
      deviceNum: 0,
      deviceLength: 0,
      size: 5,
      list: [],
      collList: [],
      coll: "0" // 收藏状态 0未收藏 1已收藏
    };
  },
  created() {
    this.person();
    // 获取菜单列表
    let menus = this.$store.state.menus.data;
    menus.forEach(v1 => {
      v1.childMenu.forEach(v2 => {
        this.list = this.list.concat(v2.childMenu);
        // console.log(this.list);
      });
    });
    // this.callList();
    // // this.dataList(this.size);
  },
  filters: {
    upper: function(value) {
      if (!value) return "";
      value = value.toString();
      return value.toLowerCase();
    },
    isNull: function(value) {
      if (!value) {
        return "——";
      } else {
        return value;
      }
    }
  },
  methods: {
    person() {
      // 个人信息接口
      axiosGet("base/user/getUser", { showLoading: true }).then(result => {
        this.tableData = result.data;
        let parmas = {
          equipNum: [],
          equipName: "",
          department: this.tableData.deptNum,

          pageSize: "",
          pageNum: "",
          type: "2"
        };
        let arr = Object.assign({}, parmas, {
          flag: true,
          useMan: [this.tableData.usrId]
        }); //个人设备
        let arr1 = Object.assign({}, parmas, { flag: false, useMan: [] }); //所管理设备
        axiosPost("archive/equipment/list", arr).then(result => {
          if (result.code == 200 && result.data && result.data.length > 0) {
            this.deviceLength = result.data.length;
          }
        });
        axiosPost("archive/equipment/list", arr1).then(result => {
          if (result.code == 200 && result.data && result.data.length > 0) {
            this.deviceNum = result.data.length;
          }
        });
      });
    },
    goSee(num) {
      this.$router.push({
        path: "/myDevice",
        query:{
          num:num
        }
      });
    },
    // 收藏
    callSave(index, url, name, coll) {
      let that = this;
      if (!coll) {
        axiosPost("base/userCollect/addOrCancel", {
          name: name,
          apiUrl: url
        }).then(res => {
          if (res.code === 200) {
            // this.$message('收藏成功！')
            that.$set(that.list[index], "coll", "1");
          }
        });
      } else if (coll === "1") {
        axiosPost("base/userCollect/addOrCancel", {
          name: name,
          apiUrl: url
        }).then(res => {
          if (res.code === 200) {
            // this.$message('取消收藏！')
            that.$set(that.list[index], "coll", "0");
          }
        });
      } else if (coll === "0") {
        axiosPost("base/userCollect/addOrCancel", {
          name: name,
          apiUrl: url
        }).then(res => {
          if (res.code === 200) {
            // this.$message('收藏成功！')
            that.$set(that.list[index], "coll", "1");
          }
        });
      }
      console.log(this.list);
    },
    // 查看--保存
    seeSave(name, url) {
      // console.log(name, url)
      axiosPost("base/userView/add", {
        name: name,
        apiUrl: url
      }).then(res => {
        console.log(res);
      });
    },
    // 获取收藏列表
    callList() {
      let that = this;
      axiosGet("base/api/getViewCollect?size=" + 20).then(res => {
        if (res.code === 200) {
          that.collList = res.data.collectList;
        }
        console.log(that.collList);
        that.list.forEach((item, index) => {
          if (this.collList) {
            that.collList.forEach(val => {
              // that.$set(item, 'coll', '0')
              if (item.name === val.name) {
                that.$set(item, "coll", "1");
                // that.list.splice(index, 1, item)
              }
            });
          }
        });
        // console.log(that.list)
        // that.$set(item, 'coll', '1')
        // that.list.splice(index, 1, item)
      });
    }
    // 获取查看和收藏列表
    // dataList(size) {
    //   axiosGet("base/api/getViewCollect?size=" + size).then(res => {
    //     if (res.code === 200) {
    //       let that = this;
    //       that.seeData = res.data.viewList; //流程数据
    //       that.collData = res.data.collectList; //收藏数据
    //       // if (this.collData) {
    //       //   that.collData.forEach((item, index) => {
    //       //     that.$set(item, "coll", "1");
    //       //     that.collData.splice(index, 1, item);
    //       //   });
    //       // }
    //       if (that.seeData) {
    //         that.seeData.forEach((item, index) => {
    //           if (that.collData) {
    //             that.collData.forEach(val => {
    //               if (item.name === val.name) {
    //                 that.$set(item, "coll", "1");
    //                 that.seeData.splice(index, 1, item);
    //               }
    //             });
    //           }
    //         });
    //       }
    //       // console.log(that.seeData);
    //     }
    //   });
    // }
  }
};
</script>
<style lang="scss" scoped>
.personal {
  .personal-info {
    border: 1px #ddd solid;
    border-top: 0;
    ul {
      width: 100%;
    }
    li {
      width: 50%;
      float: left;
      text-align: center;
      line-height: 60px;
      border: 1px #ddd solid;
      border-left: 0;
      margin: 0 -1px -1px 0;
      .til {
        width: 40%;
        float: left;
        color: #004ea2;
        background: #eff2f9;
        border-right: 1px #ddd solid;
        margin-right: -1px;
        .iconfont {
          margin-right: 10px;
          font-size: 25px;
          vertical-align: middle;
        }
      }
      .tir {
        width: 60%;
        float: left;
      }
    }
  }
  .query-title {
    margin-top: 20px;
  }
  .person-icon {
    box-sizing: border-box;
    padding-right: 10px;
    > div {
      position: relative;
      background: #ccc;
      text-align: center;
      height: 260px;
      .set-icon {
        position: absolute;
        left:50%;
        transform: translateX(-50%);
        top:40px;
        z-index: 100;
      }
    }
    ul {
      position: absolute;
      bottom: 0;
      width: 100%;
      background: #eee;
      padding: 20px 0 60px;
      font-weight: 600;
      color: #004ea2;
      li {
        padding-top: 6px;
      }
    }
  }
  .goSee {
    color: #004ea2;
    font-size: 12px;
    cursor: pointer;
    text-decoration: underline;
    padding-left:20px;
  }
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
        background: #fbeeea;
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
              background: #004ea2;
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
          background: #fbeeea;
          height: 44px;
          text-align: center;
          line-height: 44px;
          color: #ca0000;
          border-radius: 5px;
        }
      }
    }
    .list:nth-of-type(2n) {
      .topCon {
        .iconSub {
          .icon {
            background: #2fce6a;
          }
        }
      }
    }
    .list:nth-of-type(3n) {
      .topCon {
        .iconSub {
          .icon {
            background: #ee5050;
          }
        }
      }
    }
    .list:nth-of-type(4n) {
      .topCon {
        .iconSub {
          .icon {
            background: #db9e5e;
          }
        }
      }
    }
  }
}
</style>
