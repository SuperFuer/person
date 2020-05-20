<template>
  <div class="common-table">
    <!-- 部门选择 -->
    <!-- <div class="main-left">
        <el-tree
          :data="data"
          show-checkbox
          node-key="id"
          :default-expanded-keys="[2, 3]"
          :default-checked-keys="[5]"
          :props="defaultProps">
        </el-tree>
    </div>-->
    <!-- <div class="main-right"> -->
    <!-- 搜索条件 -->
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="姓名">
        <el-input v-model="formInline.name"></el-input>
      </el-form-item>
      <el-form-item label="登录名">
        <el-input v-model="formInline.loginName"></el-input>
      </el-form-item>
      <el-form-item label="手机">
        <el-input v-model="formInline.mobile"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" icon="el-icon-search" size="small">搜索</el-button>
      </el-form-item>
      <!--           <el-form-item>
            <el-button type="primary" @click.native="addUserForm" icon="el-icon-edit" size="mini">添加</el-button>
      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" @click="ExportData" icon="el-icon-share" size="small">导出</el-button>
      </el-form-item>
    </el-form>
    <!-- 用户添加 -->
    <add-userfrom :dialogAddUser.sync="addVisible"></add-userfrom>
    <!-- 表格 -->
    <!-- :data="tableData.slice((currentPage-1)*PageSize,currentPage*PageSize)" -->
    <el-table
      ref="multipleTable"
      border
      :data="tableData.slice((currentPage-1)*PageSize,currentPage*PageSize)"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="deptName" label="部门名称" show-overflow-tooltip sortable></el-table-column>
      <!--           <el-table-column
            prop="idNum"
            label="身份证号"
            show-overflow-tooltip
            sortable>
      </el-table-column>-->
      <el-table-column prop="name" label="姓名" show-overflow-tooltip sortable></el-table-column>
      <el-table-column prop="loginName" label="登录名" show-overflow-tooltip sortable></el-table-column>
      <!-- <el-table-column
            prop="title"
            label="用户职称"
            width="150px"
            sortable>
      </el-table-column>-->
      <!--           <el-table-column
            prop="positionName"
            label="职位"
            show-overflow-tooltip
            sortable>
      </el-table-column>-->
      <el-table-column prop="moduleName" label="所属模块" show-overflow-tooltip sortable></el-table-column>
      <el-table-column prop="mail" label="邮箱" show-overflow-tooltip sortable></el-table-column>
      <el-table-column prop="mobile" label="电话" show-overflow-tooltip sortable></el-table-column>
      <!-- <el-table-column
            prop="ctime"
            label="创建时间"
            width="120px">
      </el-table-column>-->
      <!--           <el-table-column
            label="状态">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-color="#13ce66"
                inactive-color="#dddddd"
                active-value="0"
                disabled
                @change="changeSwitch(scope.row.status)">
              </el-switch>
            </template>
      </el-table-column>-->
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <!--               <el-button size="mini" @click.native="editUserForm(scope.row.id, scope.row.usrId, scope.row.name, scope.row.loginName, scope.row.mail, scope.row.mobile, scope.row.deptName, scope.row.idNum)">修改</el-button>
          <el-button size="mini" @click="deleteUser(scope.row.id, scope.$index)" type="danger">删除</el-button>-->
          <el-button size="mini" @click.native="roleForm(scope.row.id)" type="primary" plain>分配角色</el-button>
          <el-button
            size="mini"
            @click.native="resetPassForm(scope.row.id)"
            type="success"
            plain
          >重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分配角色-弹窗-->
    <el-dialog title="角色分配" :visible.sync="roleVisible" width="30%" :before-close="handleClose">
      <el-checkbox-group v-model="checkItem">
        <el-checkbox v-for="item in checkList" :key="item.id" :label="item.id">{{item.roleName}}</el-checkbox>
      </el-checkbox-group>

      <span slot="footer" class="dialog-footer">
        <el-button @click="roleVisible = false">取 消</el-button>
        <el-button type="primary" @click="departmentOk">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分页 -->
    <div class="text-center">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="PageSize"
        background
        layout="total, prev, pager, next, jumper"
        :total="totalCount"
      ></el-pagination>
    </div>
    <!-- 用户修改 -->
    <edit-userfrom
      :dialogEditUser.sync="editVisible"
      :userId="userId"
      :usrId="usrId"
      :name="name"
      :loginName="loginName"
      :mail="mail"
      :mobile="mobile"
      :deptName="deptName"
      :idNum="idNum"
    ></edit-userfrom>
    <!-- 重置密码 -->
    <reset-pass :dialogResetPass.sync="resetVisible" :userId="userId"></reset-pass>
    <!-- 角色分配 -->
    <!--        <role-distribution :dialogRole.sync="roleVisible" :userId="userId"></role-distribution>-->
  </div>
</template>
<script>
import { axiosPost, axiosGet ,constApi} from "@/api/index.js";
import addUserForm from "../commponents/addUserForm.vue";
import editUserForm from "../commponents/editUserForm.vue";
import resetPass from "../commponents/resetPass.vue";
import roleDistribution from "../commponents/roleDistribution.vue";
export default {
  data() {
    return {
      addVisible: false, // 添加用户弹窗控制
      editVisible: false, // 修改用户弹窗控制
      resetVisible: false, // 重置密码弹窗控制
      roleVisible: false, // 角色分配弹窗控制
      data: [],
      constApi: constApi,
      defaultProps: {
        children: "children",
        label: "label"
      },
      formInline: {
        // 搜索内容
        name: "",
        loginName: "",
        mobile: ""
      },
      tableData: [], // 表格-内容
      rowData: null,
      value: true, // 表格-状态
      total: 0, // 总页数
      userId: "", // 组件传参
      usrId: "", // 组件传参
      name: "", // 组件传参
      mail: "", // 组件传参
      mobile: "", // 组件传参
      deptName: "", // 组件传参
      loginName: "", // 组件传参
      idNum: "", // 组件传参
      // 默认显示第几页
      currentPage: 1,
      // 总条数，根据接口获取数据长度(注意：这里不能为空)
      totalCount: 0,
      // 个数选择器（可修改）
      pageSizes: [10, 20, 30, 40],
      // 默认每页显示的条数（可修改）
      PageSize: 10,
      formLabelWidth: "120px", // 添加用户输入框宽度
      checkItem: [], // 部门选择
      // checkId:[],
      checkList: [],
      defaultProps: {
        children: "children",
        label: "id"
      }
    };
  },
  components: {
    "add-userfrom": addUserForm,
    "edit-userfrom": editUserForm,
    "reset-pass": resetPass
    // 'role-distribution' : roleDistribution
  },
  created() {
    this.userGetList(this.currentPage, this.PageSize);
    this.roleList();
  },
  methods: {
    handleSizeChange(val) {
      // 改变每页显示的条数
      this.PageSize = val;
    },
    // 当前页码
    handleCurrentChange(val) {
      // 改变默认的页数
      this.userGetList(val, this.PageSize);
    },
    changeSwitch(row) {
      console.log(row);
    },
    // 用户列表接口
    userGetList(current, size) {
      console.log(current, size);
      axiosGet("base/user/list?current=" + current + "&size=" + size).then(
        result => {
          if (result.code === 200) {
            this.tableData = result.data.records;
            this.totalCount = result.data.total;
          } else {
            this.$message("网络异常！");
          }
        }
      );
    },
    // 搜索
    onSubmit() {
      axiosGet(
        "base/user/list?loginName=" +
          this.formInline.loginName +
          "&name=" +
          this.formInline.name +
          "&mobile=" +
          this.formInline.mobile
      ).then(result => {
        if (result.code === 200) {
          this.tableData = result.data.records;
          this.totalCount = result.data.total;
        } else {
          this.$message.warning(result.message);
        }
      });
    },
    // 删除用户
    deleteUser(id, index) {
      this.$confirm("确认删除？")
        .then(_ => {
          axiosPost("base/user/delete", id).then(result => {
            if (result.code === 200) {
              this.tableData.splice(index, 1);
              this.$message("删除成功！");
            } else {
              this.$message("删除失败！");
            }
          });
          done();
        })
        .catch(_ => {});
    },
    // 导出表格excal
    ExportData() {
      var _this=this;
      axiosGet("base/user/export").then(function(result) {
        if (result.code == 200) {
          window.location.href = _this.constApi + result.data;
          console.log(result);
        }
      });
    },

    // 添加
    addUserForm: function() {
      this.addVisible = true;
    },
    // 修改
    editUserForm: function(
      id,
      usrId,
      name,
      loginName,
      mail,
      mobile,
      deptName,
      idNum
    ) {
      this.userId = id;
      this.usrId = usrId;
      this.name = name;
      this.loginName = loginName;
      this.mail = mail;
      this.mobile = mobile;
      this.deptName = deptName;
      this.idNum = idNum;
      console.log(this.idNum);
      this.editVisible = true;
    },
    // 重置密码
    resetPassForm: function(id) {
      this.$confirm("确认重置密码？")
        .then(_ => {
          axiosPost("base/user/resetPassword", id).then(result => {
            if (result.code === 200) {
              // this.tableData.splice(index, 1)
              this.$message("重置成功！");
            } else {
              this.$message(result.message);
            }
          });
          done();
        })
        .catch(_ => {});
      // this.resetVisible = true
    },
    // 分配角色
    roleForm: function(id) {
      this.userId = id;
      this.roleVisible = true;
      axiosGet("base/user/getUserRole?userId=" + id).then(result => {
        if (result.code === 200) {
          if (result.data.length > 0) {
            result.data.forEach(item => {
              this.checkItem.push(item.roleId);
            });
          }
        }
      });
    },
    // 关闭弹窗
    handleClose(done) {
      this.roleVisible = false;
    },
    // 角色
    roleList() {
      axiosGet("base/role/list?size=9999&userId=" + this.userId).then(result => {
        if (result.code === 200) {
          this.checkList = result.data.records;
        } else {
          this.$message("网络异常");
        }
      });
    },
    // 选择部门-确定
    departmentOk() {
      axiosPost("base/user/add-roles", {
        userId: this.userId,
        roleIds: this.checkItem
      }).then(result => {
        if (result.code === 200) {
          this.checkItem = [];
          this.$message("分配成功");
          this.handleClose();
        } else {
          this.$message("分配失败");
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.main-left {
  width: 300px;
  float: left;
  border: 1px #ebeef5 solid;
  padding: 10px;
  margin-right: 20px;
}
.main-right {
  width: 80%;
  float: left;
}
.el-dialog {
  width: 30%;
}
.el-form-item {
  margin-bottom: 15px;
}
.el-button--mini,
.el-button--mini.is-round {
  padding: 7px;
}
</style>
