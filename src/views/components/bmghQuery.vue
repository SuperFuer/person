<template>
    <div class="equipment">
      <div class="form-title"><i class="icon"></i>借用设备明细</div>
      <!-- 查询条件 -->
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="设备名称" label-width="107px">
          <el-input v-model="formInline.cgOrder"></el-input>
        </el-form-item><br>
        <div class="el-form-item btn-group">
          <div class="el-form-item__content">
            <el-button type="primary" @click="onSubmit(currentPage, pageSize)" icon="el-icon-search" size="mini">查 询</el-button>
          <el-button type="primary" @click="reset" icon="el-icon-search" size="mini">重 置</el-button>
          </div>
        </div>
      </el-form>
      <div class="query-title">可借用设备明细</div>
      <!-- 表格 -->
      <el-table
        ref="tableData"
        :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        tooltip-effect="dark"
        style="width: 99.9%;"
        @selection-change="handleChange"
        class="tableHei"
        >
        <el-table-column
          type="selection"
          width="55"
          :selectable="checkSelectable">
        </el-table-column>
        <el-table-column
          type="index"
          label="序号">
        </el-table-column>
        <!-- <el-table-column
          prop="assetNum"
          label="资产编码">
        </el-table-column> -->
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
          prop="module"
          label="所属模块">
        </el-table-column>
        <el-table-column
          prop="borrowDept"
          label="借用部门">
        </el-table-column>
        <el-table-column
          prop="borrowMan"
          label="借用人">
        </el-table-column>
        <el-table-column
          prop="borrowDate"
          label="借用日期">
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size="pageSize"
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
const user = JSON.parse(localStorage.getItem('user'))
import { axiosPost, axiosGet } from "@/api/index.js"
export default {
  props: {
    paramList: {
      type: Object
    }
  },
  data() {
    return {
      formInline: { // 搜索内容
        cgOrder: ''
      },
      dialogFlag: false,
      allActive: '0',
      defaultProps: {
        children: "children",
        label: "name"
      },
      eqarr: [],
      tableData: [],
      // 默认显示第几页
      currentPage: 1,
      // 总条数，根据接口获取数据长度(注意：这里不能为空)
      totalCount: 1,
      // 个数选择器（可修改）
      pageSizes: [10, 20, 30, 40],
      // 默认每页显示的条数（可修改）
      pageSize: 10
    }
  },
  created () {
  },
  methods: {
    // 当前页码
    handleCurrentChange(val) {
      this.onSubmit(val, this.pageSize)
    },
    // 查询
    onSubmit(current, size) {
      axiosGet('process/borrowReturn/list?current=' + current + '&size=' + size + '&equipName=' + this.formInline.cgOrder + '&id=').then(result => {
        if (result.code == 200) {
          this.tableData = result.data.records
          this.totalCount = result.data.total
        } else {
          this.$message.error(result.message)
        }
      })
    },
    // 重置
    reset () {
      this.formInline.ycId = '',
      this.formInline.sbCode = ''
    },
    // 勾选的表格
    handleChange(val) {
      this.eqarr = val
    },
    // 确定跳转申请页
    routeOk() {
      if (this.eqarr.length > 0) {
        if (localStorage.getItem('eqarr')) { // 从设备查询回来 已经有值 equipList
          let arrList = JSON.parse(localStorage.getItem('eqarr'));
          let arrResult = arrList.concat(this.eqarr);
          let newArr = Array.from(new Set(arrResult))
          localStorage.setItem('eqarr', JSON.stringify(newArr));
        } else {
          localStorage.setItem('eqarr', JSON.stringify(this.eqarr))
        }
        if (this.paramList.type) {
          this.$router.push({
            path: '/draftDetails',
            query: {flag: this.$route.query.flag, subject: this.$route.query.subject, applicationType: this.paramList.applicationType}
          })
        } else {
          this.$router.push({
            path: '/swIdle',
            query: {flag: this.$route.query.flag, subject: this.$route.query.subject}
          })
        }
      } else {
        this.$message.error('请勾选查询明细')
      }
    },
    
    // 已借用状态不可选 禁用
    checkSelectable (row, index) {
      if(row.status === 1 || row.status === 2 || row.status === 4) {
        return false
      } else {
        return true
      }
      //通过id来禁止不能选择的项
      // return row.status !== 3
      // return row.status !== 4
      //通过索引index来禁止不能选择的项
      // return index !== 1
    }
    
  }
}
</script>
<style lang="scss" scoped>
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
// .tableHei {
//   .el-table__body-wrapper {
//     max-height:389px;
//     overflow-y: auto;
//   }
// }
.allOder {
  padding-left: 10px;
  cursor:pointer;
}
.allOder.active{
  color: #409EFF;
}
.pop-participation {
  .el-dialog {
    width: 1000px!important;
    height: 615px;
    .divBr {
      height: 445px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      border-left: 2px solid #eee;
      overflow: auto;
      padding: 0 10px;
    }
    .el-table th.is-leaf {
      border-bottom: 1px #999 solid;
    }
    .el-table--border::after, .el-table--group::after, .el-table::before {
      background-color: #fff;
    }
    .el-table th {
      background: #fff;
    }
    .el-table__row:nth-child(2n) {
      background: #fff;
    }
  }
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
.ment-input {
  width: 100%;
  height: 30px;
  position: absolute;
  top: 0;
}
.addDia {
  .el-input {
    display: block;
  }
  .el-input__inner {
    margin: 2px 0;
  }
}

</style>
