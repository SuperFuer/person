<style lang="scss">
  .el-pagination__jump .el-input.el-pagination__editor.is-in-pagination .el-input__inner{
    width:50px;
  }
  .el-input .el-input__inner {
    width: 202px;
  }

  .demo-form-inline .el-form-item__content {
    width: 205px;
  }

  .allOder {
    padding-left: 10px;
    cursor: pointer;
  }

  .allOder.active {
    color: #409EFF;
  }

  .addInput {
    color: #26a2ff;
    cursor: pointer;
  }

  .allot-query {
    .sb-el-tree {
      // min-width: 240px;
      // max-width: 300px;
      height: 425px;
      overflow: auto;
    }

    .main-left {
      width: 150px;
      float: left;
      border: 1px #ebeef5 solid;
      padding: 10px;
      margin-right: 20px;
    }

    .main-right {
      width: 80%;
      float: left;
    }

    .el-table {
      max-height: 530px;
      overflow-x: hidden;
      overflow-y: auto;
    }

    .el-dialog {
      width: 30%;
    }

    .el-form-item {
      margin-bottom: 15px;
    }

    .el-textarea {
      position: relative;
      display: inline-block;
      width: 100%;
      vertical-align: bottom;
      font-size: 14px;
    }

    .el-form--inline {
      .btn-group {
        display: block;
        text-align: center;
        margin-top: 20px;
      }
    }

    .ment-input {
      width: 200px;
      height: 30px;
      position: absolute;
      top: 0;
    }

    .mbinput {
      margin: 5px 0;
    }

    .el-pagination {
      text-align: center;
    }

    .man-checkbox {
      .el-checkbox-group {
        width: 100%;
        box-sizing: border-box;

        .el-checkbox {
          width: 100%;
        }
      }

      .userId {
        display: inline-block;
        width: 50%;
        height: 48px;
        line-height: 48px;
      }

      .name {
        width: 33%;
      }

      .el-checkbox__input {
        width: 23%;
      }
    }

    .head {
      span {
        display: inline-block;
        width: 33%;
        text-align: left;
      }
    }

    .el-checkbox {
      display: block;
      width: 100%;
    }

    .el-checkbox__label {
      display: inline-block;
      width: 77%;
    }

    .sb-join {
      position: absolute;
      left: 50%;
      bottom: 20px;
      transform: translateX(-50%);
    }

    .small {
      padding: 8px 14px;
      font-size: 12px;
    }

    .addDia .el-input {
      display: block;
    }

    .man-checkbox .el-table__header {
      border-bottom: 1px #999 solid;
    }

    .man-checkbox .el-table th {
      background: #fff;
    }

    .all-people {
      color: blue;
      cursor: pointer;
    }

    .text-right {
      text-align: right;
      display: inline-block;
      margin-bottom: 9px;
      cursor: pointer;
      display: flex;
      align-items: flex-end;
    }

    .flex-box {
      display: flex;
      justify-content: space-around;
    }

    .el-icon-circle-plus {
      font-size: 20px;
    }

    .el-table::before {
      height: 0px;
    }

    .special {
      .el-input {
        width: auto;
      }
    }
  }

</style>
<template>
  <div class="allot-query">
    <div class="form-title"><i class="icon"></i>设备查询</div>
    <!-- 查询条件 -->
    <div class="query-title">查询条件</div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">

      <el-form-item label="设备编码" label-width="107px">
        <el-input v-if="allOrDanTiao == 0" v-model="formInline.ycId" onkeyup="value=value.replace(/[^\d]/g,'')"
                  placeholder="编码为16位"></el-input>

        <el-button style="width:202px;height:35px;padding:0" @click="dialogVisible = true"
                   v-if="allOrDanTiao > 0">已选择{{allOrDanTiao}}条
        </el-button>
        <span @click="dialogVisible = true" style="padding-left: 20px;" class="allOder active">批量添加</span>
        <span v-if="allOrDanTiao == 0 && formInline.ycId.length != 16 && formInline.ycId.length > 0"
              style="color:red;font-size: 12px;margin-left: 15px">编码位数错误</span>
        <!-- 弹窗 -->
        <el-dialog
            title="添加设备编码"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose"
            class="addDia">
          <div v-for="(item,index) in equipment" :key="index">
            <el-input style="display: inline-block;width: 210px" v-model="item.input" placeholder="请输入内容"
                      class="mbinput" onkeyup="value=value.replace(/[^\d]/g,'')">
            </el-input>
            <span v-if="!item.input || item.input.length==16"
                  style="color:#ccc;font-size: 12px">编码为16位</span>
            <span v-if="item.input && item.input.length!=16" style="color:red;font-size: 12px">编码位数错误</span>
            <i @click="addInput"
               style="font-size: 25px;margin-left: 15px;vertical-align: middle;color: #409eff;"
               v-if="index+1 == equipment.length" class="el-icon-circle-plus"></i>
          </div>
          <span slot="footer" class="dialog-footer">
              <el-button @click="closeMoble()" size="small">取 消</el-button>
              <el-button type="primary" @click="btnOk" size="small">确 定</el-button>
            </span>
        </el-dialog>
      </el-form-item>


      <br>
      <el-form-item label="设备名称" label-width="107px">
        <el-input v-model="formInline.eqName"></el-input>
      </el-form-item>
      <br>
      <el-form-item label="使用人" label-width="107px" class="special">
        <el-input v-model="formInline.usingMan" :disabled="!isAdmin"
                  @focus="dialogMan=true"></el-input>
<!--        all-people-->
        <a class="allOder active" v-if="isAdmin" @click="getAllPeople">&emsp;部门所有人</a>
      </el-form-item>
      <br>
      <div class="el-form-item btn-group">
        <div class="el-form-item__content">
          <el-button type="primary" @click="onQuery" icon="el-icon-search" size="mini">查 询</el-button>
          <el-button type="primary" @click="reset" icon="el-icon-search" size="mini">重 置</el-button>
        </div>
      </div>
    </el-form>
    <div class="query-title">查询明细</div>
    <!-- 表格 -->
    <el-table
        ref="tableData"
        :data="tableData.slice((currentPage-1)*PageSize,currentPage*PageSize)"
        tooltip-effect="dark"
        border
        style="width: 99.9%;"
        :header-cell-style="{
      'font-size':'14px',
      'padding': '8px 0',
      'font-family':'Microsoft YaHei'}"
        :cell-style="{
       'height': '45px',
       'line-height':'45px',
       'overflow':'hidden',
        'text-overflow':'ellipsis',
        'white-space':'nowrap',
        'padding':'0',
        'font-family':'Microsoft YaHei',
        'font-size':'12px'
      }"
        :row-key="getQuipRowKeys"
        @selection-change="handleSelectionChange"
    >
      <el-table-column
          :show-overflow-tooltip='true'
          type="selection"
          :reserve-selection="true"
          width="55">
      </el-table-column>
      <el-table-column
          :show-overflow-tooltip='true'
          type="index"
          label="序号"
      width="55">
      </el-table-column>
      <!-- <el-table-column
        prop="assetNum"
        label="资产编码">
      </el-table-column> -->
      <el-table-column
          :show-overflow-tooltip='true'
          prop="equipNum"
          label="设备编码">
      </el-table-column>
      <el-table-column
          :show-overflow-tooltip='true'
          prop="equipName"
          label="设备名称">
      </el-table-column>
      <el-table-column
          :show-overflow-tooltip='true'
          prop="installLocDesc"
          label="安装地点">
      </el-table-column>
      <el-table-column
          :show-overflow-tooltip='true'
          prop="usingManName"
          label="使用人">
      </el-table-column>
      <el-table-column
          :show-overflow-tooltip='true'
          prop="usingDeptName"
          label="所属部门">
      </el-table-column>
      <el-table-column
          :show-overflow-tooltip='true'
          prop="moduleName"
          label="所属模块">
      </el-table-column>
      <el-table-column
          :show-overflow-tooltip='true'
          prop="positionCode"
          label="位置编码">
      </el-table-column>
      <el-table-column
          :show-overflow-tooltip='true'
          prop="installLocDesc"
          label="位置描述">
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block">
      <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size="PageSize"
          background
          layout="total, prev, pager, next, jumper"
          :total="totalCount">
      </el-pagination>
    </div>
    <div class="el-form-item btn-group center pt20">
      <el-button type="primary" @click="routeOk" size="small">确 认</el-button>
    </div>

    <el-dialog
        top="4vh"
        title="选择使用人"
        width="80%"
        :visible.sync="dialogMan"
    >
      <el-row>
        <el-col :span="8"><b>组织人员架构</b></el-col>
        <el-col :span="10" class="pl10"><b>人员</b></el-col>
        <el-col :span="6" class="pl10"><b>已选人员</b></el-col>
      </el-row>
      <el-row>
        <el-col :span="8" class="sb-el-tree">
          <el-tree
              :data="manList"
              :default-expand-all="defaultExpandAll"
              :default-checked-keys="checkedTree"
              highlight-current
              node-key="id"
              :props="defaultProps"
              ref="tree"
              @node-click="handleNodeClick"
          ></el-tree>
        </el-col>
        <el-col :span="10" class="pl10">
          <div v-if="userData.length>0" style="width: 100%" class="man-checkbox">
            <el-table
                :data="userData"
                :row-key="getRowKeys"
                @selection-change="handleManChange"
                style="width: 100%">
              <el-table-column
                  type="selection"
                  :reserve-selection="true"
                  width="55">
              </el-table-column>
              <el-table-column
                  prop="usrId"
                  label="用户ID"
                  width="180">
              </el-table-column>
              <el-table-column
                  prop="name"
                  label="姓名">
              </el-table-column>
            </el-table>
          </div>
        </el-col>
        <el-col :span="6" style="min-width: 160px;">
          <div class="pl10">&emsp;{{selectedManList.join('，')}}</div>
        </el-col>
      </el-row>
      <div class="sb-join">
        <el-pagination
            background
            :pager-count="pageCount"
            layout="total,prev, pager, next,jumper"
            :page-size="8"
            @current-change="handleCurrentChangeUser"
            :total="total"
        ></el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogMan=false">取 消</el-button>
        <el-button type="primary" @click="getCheckedMan()" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {axiosPost, axiosGet} from "@/api/index.js"

  export default {
    data() {
      return {
        mutual: '',  // 互斥参数，用于带回
        allOrDanTiao: 0, // 显示添加多少条
        cgOrderId: [], // 使用人ID
        innerVisible: false, // 使用人选择弹出显示
        department: [], // 使用人
        dialogFlag: false, // 使用人弹窗选择判断


        deptName: '', // 调入部门
        getRowKeys(row) {
          return row.usrId;
        },
        getQuipRowKeys(row) {
          return row.equipNum;
        },
        formInline: { // 搜索内容
          ycId: '',
          eqCode: '',
          eqName: '',
          usingMan: ''
        },
        equipment: [{input: ''}, {input: ''}, {input: ''}, {input: ''}, {input: ''}, {input: ''}, {input: ''}],
        equipNum: '',
        dialogVisible: false,
        tableData: [],
        arr: [],
        value: true, // 表格-状态
        isAdmin: false,
        manList: [],
        defaultExpandAll: true,
        defaultProps: {
          children: "children",
          label: "name"
        },
        pageCount: 5,
        total: 0,
        userData: [],
        selectedManList: [],
        dialogMan: false,
        equipList: [],
        checkedTree: [],
        selectUsrId: [],
        selectEquipId: [],
        currentPage: 1, // 默认显示第几页
        manCurrentPage: 1,
        totalCount: 1, // 总条数，根据接口获取数据长度(注意：这里不能为空)
        pageSizes: [10, 20, 30, 40], // 个数选择器（可修改）
        PageSize: 100 // 默认每页显示的条数（可修改）
      }
    },
    created() {
      let user = JSON.parse(localStorage.getItem('user'))
      this.isAdmin = this.$route.query.isAdmin
      this.formInline.usingMan = this.$route.query.usingMan;
      this.formInline.usingManName = this.$route.query.usingMan;
      this.getUsingMan();
      this.totalCount = this.tableData.length
      this.selectUsrId = [user.usrId]
    },
    methods: {
      // 编码输入框点击取消
      closeMoble() {
        var that = this;
        that.dialogVisible = false
        if (!that.formInline.ycId) {
          for (var i = 0; i < that.equipment.length; i++) {
            that.equipment[i].input = ''
          }
        }
      },

      // 设备编码弹出 新增输入框
      addInput() {
        let newInput = {input: ''}
        this.equipment.push(newInput)
      },

      // 当前页码
      handleCurrentChange(val) {
        this.currentPage = val
      },
      // 查询
      onQuery() {
        var arrList = []
        if (this.formInline.ycId) {
          arrList = this.formInline.ycId.split(',')
        }
        const loading = this.$loading({
          lock: true,
          text: '正在加载...',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        const postList = {
          equipNum: arrList,
          // usingMan: this.formInline.usingMan,
          usingMan: this.selectUsrId,
          flag: this.isAdmin,
          // deptNum: this.formInline.eqCode,
          deptNum: this.formInline.deptNums,
          equipName: this.formInline.eqName
        }
        // const postList = {"equipNum":[],"usingMan":["王淑洁"],"flag":"true","deptNum":"C00","equipName":""}
        axiosPost("process/changeProcess/getEquip", postList).then(result => {
          if (result.code == 200) {
            this.tableData = result.data
            this.totalCount = this.tableData.length;
            // this.ng.closetotalCount = this.tableData.length;
            loading.close()
          } else {
            this.$message.error(result.message)
            loading.close()
          }
        })
      },
      // 获取使用人
      getUsingMan() {
        axiosGet("base/dept/tree").then(result => {
          if (result.code == 200) {
            if (result.data.length > 0) {
              this.manList = result.data;
              this.checkedTree.push(this.manList[0].deptNum);
              // console.log(this.checkedTree);
            }
          } else {
            this.$message.error(result.message)
          }
        });
      },
      // 点击最左侧树结构
      handleNodeClick(data) {
        console.log(data)
        this.deptNum = data.deptNum;
        axiosGet("base/user/list?deptNum=" + this.deptNum + "&current=" + this.manCurrentPage + "&size=8"
        ).then(result => {
          if (result.code = 200) {
            this.userData = result.data.records;
            this.total = result.data.total;
          } else {
            this.$message.error(result.message)
          }
        });
      },
      handleManChange(rows) {
        let newArr = [];
        rows.forEach((item) => {
          newArr.push(item.name);
        })
        this.selectedManList = newArr;
        this.selectUsrId = [];
        if (rows) {
          rows.forEach(row => {
            if (row) {
              this.selectUsrId.push(row.usrId);
            }
          });
        }
        // console.log(this.select_usrId);
      },
      getCheckedMan() {
        this.formInline.usingMan = this.selectedManList.join(',');
        this.dialogMan = false;
      },
      handleCurrentChangeUser(val) {
        this.manCurrentPage = val;
        axiosGet("base/user/list?deptNum=" + this.deptNum + "&current=" + this.manCurrentPage + "&size=8"
        ).then(result => {
          if (result.code = 200) {
            this.userData = result.data.records;
            this.total = result.data.total;
          } else {
            this.$message.error(result.message)
          }
        });
      },
      getAllPeople() {
        // console.log('s')
        // this.$set(this.formInline,"usingManName", '部门所有人');
        // this.usingMan = [];
        // // this.formInline.usingManName = '部门所有人';
        // this.formInline.deptNums = JSON.parse(localStorage.getItem('user')).deptNum
        // this.selectUsrId = []
        let user = JSON.parse(localStorage.getItem('user'))
        if (this.formInline.usingMan != '部门所有人') {
          this.$set(this.formInline, "usingMan", '部门所有人');
          // this.formInline.usingManName = '部门所有人'
          this.selectUsrId = []
        } else {
          this.$set(this.formInline, "usingMan", user.name);
        }
      },
      // 重置
      reset() {
        this.formInline.ycId = ''
        for (let i = 0; i < this.equipment.length; i++) {
          this.equipment[i].input = ''
        }
        this.arr = [];
        this.formInline.eqCode = ''
        this.formInline.eqName = ''
        this.formInline.usingMan = this.$route.query.usingMan
        this.allOrDanTiao = 0
      },
      onEqCode() {
        if (this.arr.length < 8) {
          this.equipment = [{input: ''}, {input: ''}, {input: ''}, {input: ''}, {input: ''}, {input: ''}, {input: ''}];
          this.arr.forEach((item, index) => {
            this.equipment[index].input = item;
          })
          let length = this.equipment;
          for (let i = 0; i < 7 - length; i++) {
            this.equipment.push({input: ''})
          }
        } else {
          this.equipment = [];
          this.arr.forEach(item => {
            this.equipment.push({input: item});
          })
        }

        // console.log(this.equipment, '开始')
        this.dialogVisible = true;
      },
      // 弹窗关闭
      handleClose() {
        // console.log(this.equipment, '关闭')
        this.dialogVisible = false;
      },
      // 设备编码弹出 新增输入框
      equBlur() {
        let every = this.equipment.every(item => {
          return item.input !== ''
        })
        if (every) {
          let newInput = {input: ''}
          this.equipment.push(newInput)
        }
      },
      // 弹窗确定
      btnOk() {
        this.arr = []
        for (var i = 0; i < this.equipment.length; i++) {
          if (this.equipment[i].input) {
            if (this.equipment[i].input && this.equipment[i].input.length != 16) {
              this.$message.error(this.equipment[i].input + '信息字数不符');
              return false;
            } else {
              this.arr.push(this.equipment[i].input)
            }
          }
        }
        this.formInline.ycId = this.arr.join(',')
        this.dialogVisible = false
        this.allOrDanTiao = this.arr.length;
      },
      // btnOk() {
      //   this.arr = []
      //   this.equipment.forEach(item => {
      //     if (item.input) {
      //       this.arr.push(item.input)
      //     }
      //   })
      //   this.formInline.eqCode = this.arr.join(',');
      //   this.dialogVisible = false;
      // },

      // 勾选的表格
      handleSelectionChange(rows) {
        this.equipList = rows;
        this.selectEquipId = [];
        if (rows) {
          rows.forEach(row => {
            if (row) {
              this.selectEquipId.push(row.equipNum);
            }
          });
        }
        this.equipNum = this.selectEquipId.join(',');
        // console.log(this.selectEquipId);
      },
      // 确定跳转申请页
      routeOk() {
        if (this.equipNum) {
          if (localStorage.getItem('equipList')) { // 从设备查询回来 已经有值
            let arrList = JSON.parse(localStorage.getItem('equipList'));
            let arrResult = [...arrList, ...this.equipList];

            let obj = {};
            let newArr = arrResult.reduce((cur, next) => {
              obj[next.equipNum] ? "" : obj[next.equipNum] = true && cur.push(next);
              return cur;
            }, [])
            localStorage.setItem('equipList', JSON.stringify(newArr));
          } else {
            localStorage.setItem('equipList', JSON.stringify(this.equipList))
            console.log(this.equipList)
          }

          this.$router.push({
            path: '/sbAllocation',
            query: {
              equipNum: this.equipNum,
              usingMan: this.formInline.usingMan,
              usingManName: this.formInline.usingManName,
              deptNum: this.formInline.eqCode,
              equipName: this.formInline.eqName,
              deptName: this.deptName,
              mutual: 'add'
            }
          })
        } else {
          this.$message('请勾选查询明细')
        }
      }
    },
    beforeRouteLeave(to, from, next) {
      // if (to.path == '/sbAllocation') {
      // }
      next();
    },
  }
</script>

