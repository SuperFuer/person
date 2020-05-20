<template>
    <div>
        <div class="form-title"><i class="icon"></i>设备查询q12</div>
        <!-- 查询条件 -->
        <div class="query-title">查询条件</div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="设备编码" label-width="107px">
                <el-input v-model="formInline.ycId" @click="dialogVisible = true"></el-input>
                <p @click="dialogVisible = true" class="ment-input"></p>
                <!-- 弹窗 -->
                <el-dialog
                        title="添加设备编码"
                        :visible.sync="dialogVisible"
                        width="30%"
                        :before-close="handleClose">
                    <el-input v-for="(item,index) in equipment" :key="index" v-model="item.input" @blur="equBlur" placeholder="请输入内容" class="mbinput"></el-input>
                    <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="btnOk">确 定</el-button>
            </span>
                </el-dialog>
            </el-form-item><br>
            <el-form-item label="设备名称" label-width="107px">
                <el-input v-model="formInline.sbCode"></el-input>
            </el-form-item><br>
            <el-form-item label="使用人" label-width="107px">
                <el-input v-model="formInline.cgOrder"></el-input>
            </el-form-item><br>
            <div class="el-form-item btn-group">
                <div class="el-form-item__content">
                    <el-button type="primary" @click="onSubmit" icon="el-icon-search" size="mini">查 询</el-button>
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
                style="width: 99.9%;"

                @selection-change="handleSelectionChange"
        >
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    type="index"
                    label="序号">
            </el-table-column>
            <el-table-column
                    prop="assetNum"
                    label="资产编码">
            </el-table-column>
            <el-table-column
                    prop="equipNum"
                    label="设备编码">
            </el-table-column>
            <el-table-column
                    prop="equipName"
                    label="设备名称">
            </el-table-column>
            <el-table-column
                    prop="installLocDesc"
                    label="安装地点">
            </el-table-column>
            <el-table-column
                    prop="usingMan"
                    label="使用人">
            </el-table-column>
            <el-table-column
                    prop="usingDept"
                    label="所属部门">
            </el-table-column>
            <el-table-column
                    prop="usingModure"
                    label="所属模块">
            </el-table-column>
            <el-table-column
                    prop="projectName"
                    label="位置编码">
            </el-table-column>
            <el-table-column
                    prop="projectName"
                    label="位置描述">
            </el-table-column>
            <el-table-column
                    prop="equipmentPrice"
                    label="采购价格">
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
    </div>
</template>
<script>
  import { axiosPost, axiosGet } from "@/api/index.js"
  export default {
    data() {
      return {
        formInline: { // 搜索内容
          ycId: '',
          sbCode: '',
          cgOrder: ''
        },
        equipment : [{
          input: ''
        }, {
          input: ''
        }, {
          input: ''
        }, {
          input: ''
        }, {
          input: ''
        }, {
          input: ''
        }, {
          input: ''
        }],
        equipNum: '',
        dialogVisible: false,
        tableData: [{
          "assetNum": 1,
          "equipNum": 2,
          "equipName": 3,
          "installLocDesc": 4,
          "usingMan": 5,
          "usingDept": 6,
          "usingModure": 3,
          "projectName": 2,
          "equipmentPrice": 1,
        }],
        arr: [],
        value: true, // 表格-状态
        // 默认显示第几页
        currentPage: 1,
        // 总条数，根据接口获取数据长度(注意：这里不能为空)
        totalCount: 1,
        // 个数选择器（可修改）
        pageSizes: [10, 20, 30, 40],
        // 默认每页显示的条数（可修改）
        PageSize: 10
      }
    },
    methods: {
      // 当前页码
      handleCurrentChange(val) {
        this.currentPage = val
      },

      // 查询
      onSubmit() {
        axiosPost("process/changeProcess/getEquip", {
          equipNum: this.arr,
          equipName: this.formInline.sbCode,
          usingMan: this.formInline.cgOrder
        }).then(result => {
          console.log(result)
          if (result.code == 200) {
            this.tableData = result.data
            this.totalCount = this.tableData.length
          }
        })
      },

      // 重置
      reset () {
        this.formInline.ycId = '',
          this.formInline.sbCode = '',
          this.formInline.cgOrder = ''
      },

      // 弹窗关闭
      handleClose(done) {
        this.dialogVisible = false
      },

      // 设备编码弹出 新增输入框
      equBlur(){
        let every = this.equipment.every( item => {
          console.log( item.input)
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
        this.equipment.forEach(item => {
          console.log(item.input)
          if (item.input) {
            this.arr.push(item.input)
          }
        })
        this.formInline.ycId = this.arr.join(',')
        this.dialogVisible = false
      },

      // 勾选的表格
      handleSelectionChange(val) {
        var eqarr = []
        val.forEach(item => {
          eqarr.push(item.equipNum)
        })
        this.equipNum = eqarr.join(',')
        console.log(this.equipNum)
      },

      // 确定跳转申请页
      routeOk() {
        if (this.equipNum) {
          this.$router.push({path: '/bfManageProcess', query: {equipNum: this.equipNum}})
        } else {
          this.$message('请勾选查询明细')
        }
      }
    }
  }
</script>
<style lang="scss" scope>
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
    .el-table__body-wrapper {
        max-height:480px;
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
</style>
