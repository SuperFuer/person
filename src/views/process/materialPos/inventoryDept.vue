<style lang="scss" scoped>
  .inventory-dept {
    .el-form /deep/ .el-input__inner {
      width: 180px;
    }
    /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
      width: auto;
    }
    .btns {
      margin: 0 0 10px 0;
      text-align: right;
    }
    .el-pagination {
      margin-top: 0;
    }
  }
</style>
<template>
  <div class="inventory-dept">
    <div class="form-title"><i class="icon"></i>部门盘点情况（设备管理员）</div>

    <div class="query-title operate">任务筛选</div>
    <el-form :model="form" :inline="true" label-width="120px">
      <el-form-item label="盘点名称">
        <el-input v-model="form.name" type="text" placeholder="请输入盘点名称"></el-input>
      </el-form-item>
      <el-form-item label="盘点年度">
        <el-date-picker
          v-model="form.inventoryYear"
          format="yyyy 年"
          value-format="yyyy"
          type="year"
          placeholder="选择年">
        </el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="使用部门">
        <el-select v-model="deptNum" placeholder="选择部门">
          <el-option
            v-for="item in form.deptList"
            :key="item.deptNum"
            :label="item.deptName"
            :value="item.deptNum">
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="" label-width="5px">
        <el-button type="primary" @click.native.prevent="getTaskList" size="small">查 询</el-button>
      </el-form-item>
    </el-form>

    <!-- table列表 -->
    <el-collapse class="common-fold common-collapse common-table" v-model="currentCollapse">
      <el-collapse-item name="1">
        <template slot="title">
          <div class="collapse-title">盘点结果</div>
        </template>
        <!--下载-->
        <div class="btns">
          <el-button class="submit-btn" size="small" @click="downloadFile(-1)">未盘点资产明细表下载</el-button>
          <el-button class="submit-btn" size="small" @click="downloadFile(1)">帐实相符资产明细表下载</el-button>
          <el-button class="submit-btn" size="small" @click="downloadFile(3)">盘盈明细表下载</el-button>
          <el-button class="submit-btn" size="small" @click="downloadFile(2)">盘亏明细表下载</el-button>
        </div>
        <el-table
          :data="tableData"
          border
          highlight-current-row>
          <el-table-column label="单选" width="65">
            <template slot-scope="scope">
            <el-radio v-model="templateSelection" :label="scope.row.id">&nbsp;</el-radio>
          </template>
          </el-table-column>
          <el-table-column label="序号" width="65" type="index"></el-table-column>
          <el-table-column prop="name" label="盘点名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="inventoryYear" label="盘点年度" show-overflow-tooltip></el-table-column>
          <el-table-column prop="inventoryTotal" label="盘点总量" show-overflow-tooltip></el-table-column>
          <el-table-column prop="notInventoryTotal" label="未盘" show-overflow-tooltip></el-table-column>
          <el-table-column prop="match" label="账实相符数" width="110" show-overflow-tooltip></el-table-column>
          <el-table-column prop="surplus" label="盘盈" show-overflow-tooltip></el-table-column>
          <el-table-column prop="deficit" label="盘亏" show-overflow-tooltip></el-table-column>
          <el-table-column label="剩余天数" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.endTime | formatDays}}
            </template>            
          </el-table-column>
          <el-table-column prop="status" label="盘点状态" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.status === -1">未开始</span>
              <span v-if="scope.row.status === 0">进行中</span>
              <span v-if="scope.row.status === 1">已结束</span>
            </template>
          </el-table-column>
          <el-table-column
            width="200"
            label="操作">
            <template slot-scope="scope">
              <el-button plain
                type="danger"
                 @click.native.prevent="inventoryDetail(scope.row)"
                size="mini">
                查询明细
              </el-button>
              <el-button plain
                v-if = "scope.row.status !== 1"
                type="success"
                @click="startApproval(scope.row)"
                size="mini">
                发起审批
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
    <!-- 分页 -->
    <div class="pagination pd20">
      <el-pagination 
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize" background
        layout="total, prev, pager, next, jumper" 
        :total="totalCount">
      </el-pagination>
    </div>
    <!--发起审批弹窗-->
    <el-dialog
      title="发起审批"
      :visible.sync="invDialog"
      width="70%">
        <inventoryApply :managementId='managementId'></inventoryApply>
    </el-dialog>
  </div>
</template>

<script>
import inventoryApply from "./inventoryApply";
import {axiosPost, axiosGet, constApi} from "@/api/index.js";
import { downloadFile, getInventoryDeptInfo, getDeptList } from '@/api/swInventory.js'

export default {
  data() {
    return {
      currentCollapse: ['1'],
      form: {
        name: '',
        inventoryYear: new Date().getFullYear() + '',
        deptList: []
      },
      _form: {},
      managementId: '',
      templateSelection: '', // table 列表当选
      deptNum: '',
      invDialog: false,
      tableData: [],
      currentPage: 1,
      totalCount: 0,
      pageSize: 10
    };
  },
  components: {
    inventoryApply
  },
  filters: {
    formatDays(endTime) {
      //计算剩余天数
      let result = endTime.substr(0, 10);
      let s1 = new Date(result.replace(/-/g, "/"));
      let s2 = new Date();
      var days = s1.getTime() - s2.getTime();
      return parseInt(days / (1000 * 60 * 60 * 24));
    }
  },
  created() {
    // 获取登录人所在的部门
    // let user = JSON.parse(localStorage.getItem('user'));
    // this.deptNum = user.deptNum;
    this.getTaskList();
    this.getDeptList();
  },
  methods: {
    //获取盘点设备列表
    getTaskList() {
      let params = JSON.parse(JSON.stringify(this.form));
      this._form = params;
      params.size = this.pageSize;
      params.current = this.currentPage;
      // params.deptList.splice(0, 1, {deptNum: this.deptNum});
      params.deptList = [];
      getInventoryDeptInfo(params).then((res) => {
        if (res.code === 200) {
          this.tableData = res.data.records;
          console.log(this.tableData);
          this.totalCount = res.data.total;
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    //获取管理列表
    getDeptList() {
      getDeptList().then((res) => {
        if (res.code === 200) {
          this.form.deptList = res.data.depts;
        }
      })
    },
    // 发起审批
    startApproval(row) {
      if (!row.notInventoryTotal) { // 发起审批
        this.managementId = row.id;
        this.invDialog = true;
        // this.$router.push({
        //   path: '/inventoryApply',
        //   query: {
        //     managementId: row.id
        //   }
        // })
      } else {
        this.$message.warning('未盘数不为0，无法发起审批');
      }
    },
    //处理分页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTaskList();
    },
    inventoryDetail (row) {
      var user = JSON.parse(localStorage.getItem('user'));
      //将deptList数组对象转化成单数组
      let dept = this._form.deptList.map(item => item.deptNum);
      this.$router.push({
        path: '/inventoryAdminDetail',
        query: {
          id: row.id,
          usrId: user.usrId,
          inventoryYear: this._form.inventoryYear,
          deptList: dept.join() //字符串形式传递
        }
      })
    },
    downloadFile(status) {
      if (!this.templateSelection) {
        this.$message.warning('请先选择您要查询的盘点单!')
        return
      }
      downloadFile({
        managementId: this.templateSelection,
        status: status,
        type: 1
      }).then((res) => {  // 1-账实相符 2-盘亏 3-盘盈 -1：待处理
        // if (res.type === 'application/json') {
        //   let reader = new FileReader();
        //   reader.onload(e => {
        //     let res = JSON.parse(e.target.result);
        //     this.$message.error(res.message);
        //     return;
        //   })
        // }
        const blob = new Blob([res], { type: 'application/vnd.ms-excel;charset=utf-8' })
        let url = window.URL.createObjectURL(blob)
        var a = document.createElement('a')
        document.body.appendChild(a)
        a.href = url
        let filename = '';
        switch(status) {
          case -1:
            filename = '未盘明细.xls'
            break;
          case 1:
            filename = '账实相符明细.xls'
            break;
          case 2:
            filename = '盘亏明细.xls'
            break;
          case 3:
            filename = '盘盈明细.xls'
            break;
        }
        a.download = filename;
        a.click()
        window.URL.revokeObjectURL(url)
      })
    }
  }
};
</script>
