<template>
  <div class="equipment">
    <!-- <div class="form-title"><i class="icon"></i>设备查询</div> -->
    <!-- 查询条件 -->
    <!-- <div class="query-title">查询条件</div> -->
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="设备名称" label-width="107px">
        <el-input v-model="formInline.sbCode"></el-input>
      </el-form-item>
      <el-form-item label="设备编码" label-width="107px">
        <el-input v-if="allOrDanTiao == 0" v-model="formInline.ycId" onkeyup="value=value.replace(/[^\d]/g,'')"
                  placeholder="编码为16位" maxlength="16" @click="dialogVisible = true"></el-input>

        <el-button style="width:202px;height:35px;padding:0" @click="dialogVisible = true"
                   v-if="allOrDanTiao > 0">已选择{{allOrDanTiao}}条
        </el-button>

      </el-form-item>
      <el-form-item label="" label-width="5px" style="width: 100px">
        <span @click="dialogVisible = true" class="allOder active">批量添加</span>
        <span v-if="allOrDanTiao == 0 && formInline.ycId.length != 16 && formInline.ycId.length > 0"
              style="color:red;font-size: 12px;margin-left: 15px">编码位数错误</span>
      </el-form-item>
      <br>
      <el-form-item label="部门"
                    label-width="107px">
        <!--            <el-input v-model="departmentQuery"></el-input>-->
        <el-select style="width:202px;"
                   :disabled="!admin"
                   class="yanshiZiJi"
                   v-model="departmentQuery"
                   filterable
                   placeholder="请选择">
          <el-option v-for="item in buMenoptions"
                     :key="item.deptNum"
                     :label="item.deptName"
                     :value="item.deptNum">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="使用人" label-width="107px" prop="cgOrder" id="yangshi">
        <el-input @focus="innerVisible = true" v-model="formInline.cgOrder" :disabled="!flag || !isDianJi" style="width:202px"></el-input>
        <span v-if="flag" @click="allOder" class="allOder active">部门所有人</span>
      </el-form-item>
      <el-form-item label="" label-width="5px">
        <el-button type="primary" @click="onSubmit" icon="el-icon-search" size="small">搜 索</el-button>
<!--        <el-button type="primary" @click="reset" icon="el-icon-search" size="small">重 置</el-button>-->
      </el-form-item>
    </el-form>
    <div class="query-title">查询明细</div>
    <!-- 表格 -->
    <el-table
        ref="multipleTableing"
        :data="tableData.slice((currentPage-1)*PageSize,currentPage*PageSize)"
        tooltip-effect="dark"
        style="width: 99.9%;"
        border
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
        @selection-change="handleChange"
        class="tableHei"
    >
      <el-table-column
          :show-overflow-tooltip='true'
          type="selection"
          :reserve-selection="true"
          width="45">
      </el-table-column>
      <el-table-column
          width="55"
          :show-overflow-tooltip='true'
          type="index"
          label="序号">
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
          prop="locationName"
          label="位置描述">
      </el-table-column>
    </el-table>
    <div>已选择： {{selectedNum}}</div>
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
    <div class="el-form-item btn-group center">
      <el-button type="primary" @click="routeOk" size="small">添加</el-button>
    </div>

    <!-- 使用人选择 -->
    <el-dialog width="70%"
               title="选择使用人"
               :visible.sync="innerVisible"
               class="pop-participation"
               append-to-body>
      <!--                组织架构组件-->
      <orgstructure ref="getZiZuJianList"
                    v-on:childByValue="childByValue"></orgstructure>
    </el-dialog>
<!--    <el-dialog-->
<!--        width="30%"-->
<!--        title="使用人选择"-->
<!--        :visible.sync="innerVisible"-->
<!--        class="pop-participation"-->
<!--        append-to-body>-->
<!--      <div class="p-heading el-row">-->
<!--        <div class="el-col el-col-7">-->
<!--          <div class="heading">组织人员架构</div>-->
<!--        </div>-->
<!--        <div class="el-col el-col-10">-->
<!--          <div class="heading">人员</div>-->
<!--        </div>-->
<!--        <div class="el-col el-col-7">-->
<!--          <div class="heading">已选人员</div>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="participation-info el-row">-->
<!--        <div class="el-col el-col-7 divBr">-->
<!--          <el-tree-->
<!--              :data="department"-->
<!--              ref="tree"-->
<!--              node-key="id"-->
<!--              default-expand-all-->
<!--              :props="defaultProps"-->
<!--              @node-click="childrenNodeClick">-->
<!--          </el-tree>-->
<!--        </div>-->
<!--        <div class="el-col el-col-10 divBr">-->
<!--          &lt;!&ndash; 表格 &ndash;&gt;-->
<!--          <el-table-->
<!--              ref="multipleTable"-->
<!--              :data="peopoData"-->
<!--              tooltip-effect="dark"-->
<!--              style="width: 100%"-->
<!--              @selection-change="handleSelectionChange">-->
<!--            <el-table-column-->
<!--                type="selection"-->
<!--                width="55">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--                prop="usrId"-->
<!--                label="用户Id"-->
<!--                width="180">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--                prop="name"-->
<!--                label="姓名"-->
<!--                width="150">-->
<!--            </el-table-column>-->
<!--          </el-table>-->
<!--        </div>-->
<!--        <div class="el-col el-col-7 divBr">-->
<!--          {{multipleSelection}}-->
<!--          &lt;!&ndash; <ul>-->
<!--            <li v-for="(item, index) in multipleSelection" :key="index">{{item.name}}</li>-->
<!--          </ul> &ndash;&gt;-->
<!--        </div>-->
<!--      </div>-->

<!--      <div class="el-dialog__footer">-->
<!--        <el-button @click="innerVisible = false" size="small">取 消</el-button>-->
<!--        <el-button type="primary" @click="departmentOk" size="small">确 定</el-button>-->
<!--      </div>-->
<!--    </el-dialog>-->

    <!-- 弹窗 -->
    <el-dialog
        title="添加设备编码"
        :visible.sync="dialogVisible"
        append-to-body
        width="30%"
        :before-close="handleClose"
        class="addDia">
      <div v-for="(item,index) in equipment" :key="index" class="inputs">
        <el-input style="display: inline-block;width: 210px" maxlength="16" v-model="item.input" placeholder="请输入内容"
                  class="mbinput" onkeyup="value=value.replace(/[^\d]/g,'')">
        </el-input>
        <span v-if="!item.input || item.input.length==16"
              style="color:#ccc;font-size: 12px">编码为16位</span>
        <span v-if="item.input && item.input.length!=16" style="color:red;font-size: 12px">编码位数错误</span>
        <i @click="addInput"
           style="font-size: 25px;margin-left: 15px;vertical-align: middle;color: #409eff;"
           v-if="index+1 == equipment.length" class="el-icon-circle-plus"></i>
      </div>
      <!--                    <p @click="addInput" class="addInput">新增</p>-->
      <span slot="footer" class="dialog-footer">
          <el-button @click="closeMoble()" size="small">取 消</el-button>
          <el-button type="primary" @click="btnOk" size="small">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
const user = JSON.parse(localStorage.getItem('user'))
import {axiosPost, axiosGet} from "@/api/index.js";
import orgstructure from '@/components/orgstructure'

export default {
  props: {
    paramList: Object
  },
  components: {
    orgstructure
  },
  data() {
    return {
      admin: false,
      departmentQuery: '',
      innVVVV: false, // 测试更改
      allOrDanTiao: 0, // 显示添加多少条
      formInline: { // 搜索内容
        ycId: '',
        sbCode: '',
        cgOrder: ''
      },
      selectedNum: 0,
      cgOrderId: [], // 使用人ID
      innerVisible: false, // 使用人选择弹出显示
      department: [], // 使用人
      dialogFlag: false, // 使用人弹窗选择判断
      defaultProps: {
        children: "children",
        label: "name"
      },
      disabled: false,
      equipment: [{
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
      // rules: {
      //   cgOrder: {
      //     required: true,
      //     message: "使用人不能为空",
      //     trigger: "blur"
      //   }
      // },
      equipList: [],
      checkedList: [],
      multipleSelection: '',
      equipNum: '',
      dialogVisible: false,
      tableData: [],
      peopoData: [],
      arr: [],
      value: true, // 表格-状态
      // 默认显示第几页
      currentPage: 1,
      // 总条数，根据接口获取数据长度(注意：这里不能为空)
      totalCount: 0,
      // 个数选择器（可修改）
      pageSizes: [10, 20, 30, 40],
      // 默认每页显示的条数（可修改）
      PageSize: 5,
      flag: false,   // 本登录人角色是否为管理
      isCaoGao: false,
      yeWuN: '',   // 业务模块经理人Name
      yeWuI: '',    // 业务模块Id
      buMenoptions: [],
      isDianJi: false,
    }
  },

  created() {
    this.getChaXunInitList();
    let flag = this.$route.query.flag
    this.flag = this.$route.query.flag
    this.yeWuN = this.$route.query.yeWuN
    this.yeWuI = this.$route.query.yeWuI
    this.isCaoGao = this.$route.query.isCaoGao
    var user = JSON.parse(localStorage.getItem('user'))
    this.cgOrderId = [user.usrId]
    if (flag == 'true') {
      // 使用人选择(管理员可选所有人)
      // this.dialogFlag = true
      const loading = this.$loading({
        lock: true,
        text: '正在加载...',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      axiosGet('base/dept/tree').then(result => {
        if (result.code === 200) {
          loading.close()
          this.department = result.data
          this.formInline.cgOrder = user.name
        }
      })
    } else {
      this.formInline.cgOrder = user.name
      this.flag = false
    }
    // this.totalCount = this.tableData.length
    // console.log(this.totalCount)
  },
  methods: {
    // get子组件数据
    childByValue: function (childValue) {
      console.log(childValue)
      if (childValue != '0') {
        let name = []
        let id = []
        for (var i = 0; i < childValue.length; i++) {
          name.push(childValue[i].name)
          id.push(childValue[i].usrId)
        }
        this.formInline.cgOrder = name.join(',')
        // this.ursData.id = id
        this.cgOrderId = id;
      }
      this.innerVisible = false
    },
    // process/common/init-query
    getChaXunInitList(){
      axiosGet('process/common/init-query').then(res => {
        if (res.code === 200) {
          this.buMenoptions = res.data.depts
          for(var i=0;i<this.buMenoptions.length;i++){
            if(this.buMenoptions[i].selected){
              this.departmentQuery = this.buMenoptions[i].deptNum
            }
          }
          this.admin = res.data.isEqMgr
          this.flag = res.data.isEqMgr
          this.isDianJi = res.data.isEqMgr
        } else {
          this.$message.error(res.message)
        }
      })
    },

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

    // 记录当前页是否被选中过
    getQuipRowKeys(row) {
      return row.equipNum;
    },

    // 当前页码
    handleCurrentChange(val) {
      this.currentPage = val
    },

    // 勾选的表格
    handleChange(val) {
      this.selectedNum = val.length;
      this.equipList = val;
    },

    // 查询
    onSubmit() {
      var arrList = []
      if (this.formInline.ycId) {
        arrList = this.formInline.ycId.split(',')
      }
      var params = {
        equipNum: arrList, // 设备编号
        equipName: this.formInline.sbCode, // 设备名称
        usingMan: this.cgOrderId,  // 使用人ID
        flag: this.flag, // 是否管理员
        deptNum: this.departmentQuery, // 申请人部门编号
      }
      console.log(params)
      const loading = this.$loading({
        lock: true,
        text: '正在加载...',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      axiosPost("process/changeProcess/getEquip", params).then(result => {
        if (result.code == 200) {
          this.tableData = result.data
          this.totalCount = this.tableData.length
          loading.close()
        } else {
          loading.close()
          this.tableData = []
          this.$message.error(result.message)
        }
      })
    },
    // 重置
    reset() {
      this.formInline.ycId = ''
      this.formInline.sbCode = ''
      this.formInline.cgOrder = user.name
      this.arr = []
      this.allOrDanTiao = 0
      for (var i = 0; i < this.equipment.length; i++) {
        this.equipment[i].input = ''
      }
    },
    // 弹窗关闭
    handleClose(done) {
      this.dialogVisible = false
    },
    // 设备编码弹出 新增输入框
    addInput() {
      let newInput = {input: ''}
      this.equipment.push(newInput)
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
    // 确定跳转申请页
    routeOk() {
      if (this.equipList.length) {
        this.$emit('getEquipList', this.equipList)
      } else {
        this.$message.error('请勾选查询明细')
      }
      this.$refs.multipleTableing.clearSelection();
    },
    // 选择使用人-确定
    departmentOk() {
      this.formInline.cgOrder = this.multipleSelection
      // 关闭部门选择
      this.innerVisible = false
    },
    //点击最左侧
    childrenNodeClick(data) {
      var _this = this
      _this.deptNum = data.deptNum
      // console.log(_this.deptNum)
      localStorage.setItem('peopo', JSON.stringify(this.multipleSelection))
      axiosGet('base/user/list?deptNum=' + _this.deptNum + '&current=0&size=9999').then(res => {
        if (res.code === 200) {
          _this.peopoData = res.data.records
        } else {
          _this.$message.error(res.message)
        }
      })
    },
    handleSelectionChange(val) {
      this.cgOrderId = []
      console.log(val, '测试')
      var arr = []
      val.forEach(item => {
        arr.push(item.name)
        this.cgOrderId.push(item.usrId)
      })
      this.multipleSelection = arr.join(',')
    },
    // 部门所有人
    allOder() {
      // var user = JSON.parse(localStorage.getItem('user'))
      if (this.formInline.cgOrder != '部门所有人') {
        this.isDianJi = false;
        this.formInline.cgOrder = '部门所有人'
        this.cgOrderId = []
      } else {
        this.isDianJi = true;
        this.formInline.cgOrder = user.name
        this.cgOrderId = [user.usrId]
      }
    }
  }
}

</script>
<style lang="scss" scoped>
  .inputs {
    margin-bottom: 10px;
  }

  .el-input__inner {
    width: 180px;
  }

  .equipment {
#yangshi .el-input__inner{
  width: 202px;
}
    #yangshi /deep/ .el-form-item__content{
      width: 100%;
    }
    padding-bottom: 10px;

    .el-input .el-input__inner {
      width: 202px;
    }

    .demo-form-inline .el-form-item__content {
      width: 205px;
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

    .tableHei {
      .el-table__body-wrapper {
        max-height: 389px;
        overflow-y: auto;
      }
    }

    .allOder {
      padding-left: 10px;
      cursor: pointer;
    }

    .allOder.active {
      color: #409EFF;
    }

    .pop-participation {
      .el-dialog {
        width: 1000px !important;
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

    .btn-group {
      display: block;
      text-align: center;
      padding-top: 10px;
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
        width: 230px;
      }

      .el-input__inner {
        margin: 2px 0;
        width: 202px;
      }

      .el-dialog__body {
        height: 330px;
        overflow-y: auto;
      }
    }

    .addInput {
      color: #26a2ff;
      cursor: pointer;
    }

    .el-pagination__editor .el-input__inner {
      width: 50px;
    }
  }
</style>
