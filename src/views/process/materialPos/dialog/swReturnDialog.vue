<!--
 * @Description: 资产闲置处置申请页面=>新增数据弹框页面
 * @Version:
 * @Autor: louisyi
 * @Date: 2019-09-04 15:36:03
 * @LastEditors: louisyi
 * @LastEditTime: 2019-09-10 20:41:54
 -->

<template>
  <div class="swReturnDialog">
    <el-dialog title="添加设备"
               :visible.sync="addPopDialog"
               width="70%"
               :before-close="handlePopClose">
      <div class="seal-query">
        <el-form :inline="true"
                 label-width="80px">
          <div>
            <el-form-item label="设备编码"
                          label-width="80px">
              <el-input style="width:202px"
                        v-model="equipCodeQuery"></el-input>
            </el-form-item>
            <el-form-item label="设备名称"
                          label-width="80px">
              <el-input style="width:202px"
                        v-model="searchInput.equipName"></el-input>
            </el-form-item>
          </div>

          <el-form-item label="部门"
                        label-width="80px">
            <el-select :disabled="!admin"
                       v-model="searchInput.useDept"
                       style="width:202px"
                       filterable
                       placeholder="请选择">
              <el-option v-for="item in dialogData.depts"
                         :key="item.id"
                         :label="item.deptName"
                         :value="item.deptNum">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="使用人"
                        label-width="80px">
            <el-input style="width:202px"
                      v-model="dialogData.usingManName"
                      @focus="getDeptAll"
                      :disabled="!admin || dialogData.usingManName == '部门所有人'"></el-input>
            <span @click="allOder"
                  v-if="admin"
                  style="padding-left: 10px;cursor: pointer;color: #409EFF;"
                  class="allOder active">部门所有人</span>
            <!-- 使用人选择 -->
            <el-dialog width="70%"
                       title="选择使用人"
                       :visible.sync="innerVisible"
                       class="pop-participation"
                       append-to-body>

              <orgstructure ref="getZiZuJianList"
                            v-on:childByValue="childByValue"></orgstructure>

            </el-dialog>
          </el-form-item>

          <el-form-item style="padding-left:10px;position:relative;top:-2px;">
            <el-button type="primary"
                       size="mini"
                       @click="getDisposalEquipList"
                       icon="el-icon-search">搜索</el-button>
          </el-form-item>
        </el-form>
        <div class="query-title">查询闲置设备</div>
        <el-table ref="multipleTable"
                  :data="tableData.slice((popCurrentPage-1)*popPageSize,popCurrentPage*popPageSize)"
                  v-loading="tableLoading"
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
                  @selection-change="handlePopSelect"
                  :row-key="popRowKey">
          <el-table-column :show-overflow-tooltip="true"
                           type="selection"
                           :reserve-selection="true"
                           width="55"></el-table-column>
          <el-table-column :show-overflow-tooltip="true"
                           type="index"
                           label="序号"
                           width="55"></el-table-column>
          <!-- <el-table-column prop="assetNum"
                           label="资产编码"></el-table-column> -->
          <el-table-column :show-overflow-tooltip="true"
                           prop="equipNum"
                           label="设备编码"></el-table-column>
          <el-table-column :show-overflow-tooltip="true"
                           prop="equipName"
                           label="设备名称"></el-table-column>
          <el-table-column :show-overflow-tooltip="true"
                           prop="equipmentType"
                           label="规格型号"></el-table-column>
          <el-table-column :show-overflow-tooltip="true"
                           prop="installPosition"
                           label="安装地点"></el-table-column>
          <el-table-column :show-overflow-tooltip="true"
                           prop="useManName"
                           label="使用人"></el-table-column>
          <el-table-column :show-overflow-tooltip="true"
                           prop="useDeptName"
                           label="使用人部门"
                           width="120px"></el-table-column>
          <el-table-column :show-overflow-tooltip="true"
                           prop="moduleName"
                           label="所属模块"></el-table-column>
          <el-table-column :show-overflow-tooltip="true"
                           prop="purchasePrice"
                           label="采购价格"></el-table-column>

        </el-table>
        <div>已选择：{{popNumber}}</div>
        <!-- 分页 -->
        <div class="pagination">
          <el-pagination background
                         layout="total, prev, pager, next, jumper"
                         :total="tableData.length"
                         :page-size="popPageSize"
                         :current-page.sync="popCurrentPage"
                         @current-change="handlePopPagination"></el-pagination>
        </div>
        <div class="el-form-item btn-group center pt20">
          <el-button type="primary"
                     size="small"
                     @click="submitAdd">添加</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDisposalEquipList, getDialogInitData, getDeptAll, getDeptUser } from '@/api/swApi.js'
import orgstructure from '@/components/orgstructure'
import dayjs from 'dayjs'
export default {
  data () {
    return {
      sealDetailList: [], // 封存选择list
      delectDetailList: [],
      tableData: [],
      popMultipleSelect: [],
      popCurrentPage: 1,
      popPageSize: 5,
      popRowKey (row) {
        return row.equipNum
      },
      searchInput: {
        equipNum: '', // 设备编码
        equipName: '', // 设备名称
        useDept: '', // 部门
        userMans: [] // 使用人
      },
      dialogData: {},
      tableLoading: false, // 表格加载
      innerVisible: false, // 选择人弹框控制字段
      admin: false, // 是否是管理员
      selectPeople: [], // 选中的人
      buMenList: [], // 全部部门列表
      buMenRenList: [], // 部门下所有人列表
      departmentQuery: '', // 部门id
      popNumber: 0 // 已选择
    }
  },
  components: {
    orgstructure
  },
  computed: {
    equipCodeQuery: {
      get: function () {
        return this.searchInput.equipNum
      },
      set: function (val) {
        // 限制输入30
        this.searchInput.equipNum = val.slice(0, 30)
      }
    },
    addPopDialog: {
      get () {
        return this.value
      },
      set () {
        this.$emit('input', false)
      }
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    addPopDialog () {
      if (this.addPopDialog) {
        this.getDialogInitData()
      }
    }
  },
  methods: {

    handlePopClose () {
      this.addPopDialog = false
    },
    searchData () {
      if (this.searchInput.equipNum) {
        this.tableData = this.tableData.filter(e => e.equipNum.search(this.searchInput.equipNum) > -1)
      }
    },
    // 关闭多条设备查询弹框
    handleClose (done) {
      this.dialogVisible = false
    },
    handlePopSelect (val) {
      this.popMultipleSelect = val
      this.popNumber = this.popMultipleSelect.length
    },
    handlePopPagination (val) {
      this.popCurrentPage = val
    },
    submitAdd () {
      this.addPopDialog = false
      this.$emit('getSelectList', this.popMultipleSelect)
      this.sealDetailList = this.popMultipleSelect
      let date = dayjs(Date.now()).format('YYYY-MM-DD')
      this.sealDetailList.forEach(e => {
        this.$set(e, 'handleAmount', 0)
        this.$set(e, 'handleTime', date)
      })
    },
    // 获取弹框初始化数据
    getDialogInitData () {
      getDialogInitData().then((res) => {
        if (res.code === 200) {
          this.dialogData = res.data
          this.admin = res.data.isEqMgr
          this.searchInput.userMans = [res.data.usingMan]
          res.data.depts.forEach(e => {
            if (e.selected === true) {
              this.searchInput.useDept = e.deptNum
            }
          })
          // this.getDisposalEquipList()
        }
      })
    },
    // 获取所有部门
    getDeptAll () {
      this.innerVisible = true
      getDeptAll({
        // id: this.searchInput.useDept
        id: '62'
      }).then((result) => {
        this.buMenList = result.data.data
      })
    },
    // 选择使用人-取消
    departmentClose () {
      this.selectPeople = []
      this.innerVisible = false
    },
    // 部门所有人
    allOder () {
      let user = JSON.parse(localStorage.getItem('user'))
      if (this.dialogData.usingManName !== '部门所有人') {
        this.dialogData.usingManName = '部门所有人'
        this.searchInput.userMans = []
      } else {
        this.dialogData.usingManName = user.name
        this.searchInput.userMans = [user.usrId]
      }
    },
    // 选择使用人
    setPartments (val) {
      this.selectPeople.push(val)
      // this.selectPeople = Array.from(new Set(this.selectPeople))
    },

    // 删除选中人
    handleCloseList (tag) {
      this.selectPeople.splice(this.selectPeople.indexOf(tag), 1)
    },

    // 获取部门下人员
    getDeptUser (id) {
      getDeptUser({
        id: id
      }).then((res) => {
        this.buMenRenList = res.data.data
        this.selectPeople = []
      })
    },

    // 父组件调用子组件删除选中
    delData (list) {
      this.$refs.multipleTable.clearSelection()
    },
    // // 选择使用人 - 确定
    // departmentOk () {
    //   let name = []
    //   let usrId = []
    //   for (var i = 0; i < this.selectPeople.length; i++) {
    //     name.push(this.selectPeople[i].name)
    //     usrId.push(this.selectPeople[i].usrId)
    //   }

    //   this.dialogData.usingManName = name.join(',')
    //   this.dialogData.usingMan = usrId
    //   this.searchInput.userMans = usrId
    //   this.innerVisible = false
    // },

    // get子组件数据
    childByValue: function (childValue) {
      if (childValue !== '0') {
        let name = []
        let id = []
        for (var i = 0; i < childValue.length; i++) {
          name.push(childValue[i].name)
          id.push(childValue[i].usrId)
        }
        this.selectUsrId = id
        this.dialogData.usingMan = id
        this.searchInput.userMans = id
        this.dialogData.usingManName = name.join(',')
      }
      this.innerVisible = false
    },

    // 获取设备列表
    getDisposalEquipList () {
      this.tableLoading = true
      getDisposalEquipList(this.searchInput).then((res) => {
        if (res.code === 200) {
          this.tableData = res.data
        }
        this.tableLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.swReturnDialog {
  .btn-group {
    display: block;
    text-align: center;
    padding-bottom: 20px;
    .save-btn.el-button {
      background: #2fce6a;
      color: #fff;
    }
    .submit-btn.el-button {
      background: #004ea2;
      color: #fff;
    }
  }

  .allOder {
    padding-left: 10px;
    cursor: pointer;
  }

  .allOder.active {
    color: #409eff;
  }

  /deep/ .el-input.is-disabled .el-input__inner {
    width: 100%;
  }
}
</style>
