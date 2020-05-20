<style lang="scss" scoped>
  .inventory-task {
    .operate {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .row-total {
      text-align: right;
      font-weight: bold;
      span {
        display: inline-block;
        margin: 0 10px;
      }
    }
    .bluebtn {
      background: #004ea2;
      height: 28px;
      border: 1px solid #004ea2;
      color: #fff;
      margin-top: 2px;
    }
    .red {
      color: red;
    }
    .blue {
      color: blue;
    }
    em {
      font-style: normal;
    }
  }
</style>
<template>
  <div class="inventory-task">
    <div class="form-title"><i class="icon"></i>盘点任务（设备使用人）</div>

    <!-- table列表 -->
    <el-collapse class="common-fold common-collapse common-table mt10" v-model="currentCollapse">
      <el-collapse-item name="1">
        <template slot="title">
          <div class="collapse-title operate">
            <span>盘点任务</span>
            <span>
              <el-button class="bluebtn" size="mini" @click.stop="downloadTask">下 载</el-button>
              <el-button type="primary" size="mini" @click.stop="addEquip">新 增</el-button>
            </span>
          </div>
        </template>
        <div class="row-total mb10">距离盘点结束还有<em class="red font-bold"> {{lastDays}} </em>天</div>
        <div class="row-total mb10" v-if="invInfo">
          <span>未盘设备：<em class="blue">{{invInfo.notInventoryTotal}}</em></span>
          <span>当前盘盈数：<em class="blue">{{invInfo.surplus}}</em></span>
          <span>当前盘亏数：<em class="blue">{{invInfo.deficit}}</em></span>
          <span>帐实相符：<em class="blue">{{invInfo.match}}</em></span>
        </div>

        <el-table
          :data="tableData.slice((currentPage-1)*pageSize, currentPage*pageSize)"
          border
          highlight-current-row>
          <el-table-column label="序号" width="65" type="index"></el-table-column>
          <el-table-column prop="date" label="盘点结果" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="scope.row.result === 3">盘盈</div>
              <el-select v-else v-model="scope.row.result" placeholder="请选择">
                <el-option
                  v-for="item in invResult"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="equipNum" label="设备编码" show-overflow-tooltip></el-table-column>
          <el-table-column prop="equipName" label="设备名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="installLocDesc" label="安装地点" show-overflow-tooltip></el-table-column>
          <el-table-column prop="invType" label="规格型号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="factoryNum" label="出厂序号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="remark" label="备注" placeholder="请填写备注">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" type="text"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            width="100"
            label="操作">
            <template slot-scope="scope">
              <el-button plain
                v-if="scope.row.result === 3"
                type="success"
                @click.native.prevent="deleteTask(scope.row.id)"
                size="mini">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination">
          <el-pagination 
            @current-change="handleCurrentTask"
            :current-page="currentPage"
            :page-size="pageSize" background
            layout="total, prev, pager, next, jumper" 
            :total="totalCount">
          </el-pagination>
        </div>
      </el-collapse-item>
    </el-collapse>


    <div class="btns">
      <el-button @click="onSubmit" class="save-btn" size="small">保 存</el-button>
    </div>
    <!-- 新增盘点任务：弹窗部分 -->
    <el-dialog
      title="新增设备"
      :before-close="closeDialog"
      :visible.sync="addEquipDialog"
      width="50%">
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="120px">
        <el-form-item label="设备名称" prop="equipName">
          <el-input v-model.trim="form.equipName" type="text" placeholder="请输入设备名称"></el-input>
        </el-form-item>
        <el-form-item label="设备编码">
          <el-input v-model="form.equipNum" type="text" maxlength="16" placeholder="请输入设备编码"></el-input>
        </el-form-item>
        <!-- <el-form-item label="资产编码">
          <el-input v-model="form.assetNum" type="text" placeholder="请输入资产编码"></el-input>
        </el-form-item> -->
        <el-form-item label="规格型号">
          <el-input v-model="form.model" type="text" placeholder="请输入规格型号"></el-input>
        </el-form-item>
        <el-form-item label="出厂序号">
          <el-input v-model="form.factoryNum" type="text" placeholder="请输入出厂序号"></el-input>
        </el-form-item>
        <el-form-item label="安装地点">
          <el-input v-model="form.installLocDesc" type="text" placeholder="请输入安装地点"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="请填写备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取 消</el-button>
        <el-button size="small" type="primary" @click="addTask('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {axiosPost, axiosGet, constApi} from "@/api/index.js";
import { downloadFile, getinventoryUsingMan, getinventorySingleStatistics, addInventoryDetail, doInventoryUsingMan, removeInventory } from '@/api/swInventory.js'
export default {
  data() {
    return {
      addEquipDialog: false,  // 新增盘点任务弹窗控制
      currentCollapse: ['1'],
      managementId: '',
      form: {
        equipName: '',
        equipNum: '',
        assetNum: '',
        model: '',
        factoryNum: '',
        installLocDesc: '',
        remark: ''
      },
      rules: {
        equipName: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
      },
      invResult: [ // 1-账实相符 2-盘亏 3-盘盈 -1：待处理
        {
          value: 1,
          label: "账实相符"
        },
        {
          value: 2,
          label: "盘亏"
        },
        {
          value: -1,
          label: "待处理"
        }
      ],
      lastDays: 0, //剩余天数
      invInfo: {},
      tableData: [],
      currentPage: 1,
      totalCount: 0,
      pageSize: 10
    };
  },
  created() {
    this.getTaskList();
    this.getEquipNumbers();
  },
  methods: {
    //获取盘点设备数
    getEquipNumbers() {
      getinventorySingleStatistics().then((res) => {
        if (res.code === 200) {
          this.invInfo = res.data;
          //计算剩余天数
          let result = res.data.endTime.substr(0, 10);
          let s1 = new Date(result.replace(/-/g, "/"));
          let s2 = new Date();
          var days = s1.getTime() - s2.getTime();
          this.lastDays = parseInt(days / (1000 * 60 * 60 * 24));
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    //获取盘点设备列表
    getTaskList() {
      getinventoryUsingMan().then((res) => {
        if (res.code === 200) {
          if (res.data.length) {
            this.tableData = res.data;
            this.totalCount = res.data.length;
            this.managementId = res.data[0].managementId;
          }
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    //新增任务
    addTask(formName) {
      let params = this.form;
      params.managementId = this.managementId;

      this.$refs[formName].validate((valid) => {
        if (valid) {
          addInventoryDetail(params).then((res) => {
            if (res.code === 200) {
              this.addEquipDialog = false;
              this.$message.success('新增成功！');
              this.getTaskList();
            } else {
              this.$message.warning(res.message)
            }
          })  
        } else {
          console.log('error submit!!');
          return false;
        }
      }); 
    },
    //处理分页
    handleCurrentTask(val) {
      this.currentPage = val;
    },
    //保存
    onSubmit() {
      let params = this.tableData;
      doInventoryUsingMan(params).then((res) => {
        if (res.code === 200) {
          this.$message.success('保存成功！');
          this.getTaskList();
          this.getEquipNumbers();
        } else {
          this.$message.warning(res.message)
        }
      })  
    },
    //盘点任务下载
    downloadTask() {
      downloadFile({
        managementId: '',
        status: '',
        type: 2
      }).then((res) => {
        const blob = new Blob([res], { type: 'application/vnd.ms-excel;charset=utf-8' })
        let url = window.URL.createObjectURL(blob)
        var a = document.createElement('a')
        document.body.appendChild(a)
        a.href = url
        a.download = '盘点任务.xls'
        a.click()
        window.URL.revokeObjectURL(url)
      })
    },
    //删除
    deleteTask(id) {
      removeInventory({
        id: id
      }).then((res) => {
        if (res.code === 200) {
          this.$message.success('删除成功！');
          this.getTaskList();
        } else {
          this.$message.warning(res.message)
        }
      })  
    },
    //新增
    addEquip() {
      this.addEquipDialog = true;
    },
    //关闭
    closeDialog() {
      this.addEquipDialog = false;
      for(let key in this.form) {
        this.form[key] = '';
      }
    }
  }
};
</script>
