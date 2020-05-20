<template>
  <div class="custom-tree-container main">
    <div class="main-left">
      <div class="block">
        <el-tree
          :data="data"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span @click="linkData(data)">
              <i class="iconfont bmicon icon-zuzhijiagou"></i>
              {{ data.name }}
            </span>
            <span class="icon">
              <el-button
                type="text"
                size="mini"
                @click="() => append(data)"
                >
                <i class="iconfont icon-tianjia"></i>
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="() => edit(data)"
                >
                <i class="iconfont icon-xiugai2"></i>
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="() => remove(node, data)">
                <i class="iconfont icon-icon" v-if="data.children.length > 0 ? isShow : !isShow"></i>
              </el-button>
            </span>
          </span>
        </el-tree>
      </div>
      <!-- 添加部门-弹窗Form -->
      <el-dialog title="添加部门" :visible.sync="addVisible" :before-close="hidePanel">
        <el-form :model="addDicForm" :rules="rules" ref="addDicForm">
          <el-form-item label="部门名称:" :label-width="formLabelWidth" prop="name">
            <el-input v-model="addDicForm.name" ></el-input>
          </el-form-item>
          <el-form-item label="父级部门编号:" :label-width="formLabelWidth">
            {{parentDeptNum}}
          </el-form-item>
          <el-form-item label="顶级节点编号:" :label-width="formLabelWidth">
            {{topNodeCode}}
          </el-form-item>
          <el-form-item label="显示名称:" :label-width="formLabelWidth">
            <el-input v-model="addDicForm.displayName" ></el-input>
          </el-form-item>
          <el-form-item label="描述:" :label-width="formLabelWidth">
            <el-input v-model="addDicForm.description" ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="hidePanel" size="small">取 消</el-button>
          <el-button type="primary" @click="addDicSave('addDicForm')" size="small">确 定</el-button>
        </div>
      </el-dialog>
      <!-- <add-depfrom :dialogAddUser.sync="addVisible" :parentDeptNum="parentDeptNum" :topNodeCode="topNodeCode"></add-depfrom> -->
    </div>
    <div class="main-right">
      <div v-if="type === '0' ? !isShow : isShow">
        <p class="til"><i class="iconfont icon-renwu"></i>查看</p>
        <el-form :label-position="labelPosition" :rules="rules" label-width="80px" :model="formLabelAlign">
          <el-form-item label="部门全称" prop="name">
            <el-input v-model="formLabelAlign.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="部门简称">
            <el-input v-model="formLabelAlign.displayName" disabled></el-input>
          </el-form-item>
          <el-form-item label="部门编码">
            <el-input v-model="formLabelAlign.deptNum" disabled></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="type === '1' ? !isShow : isShow">
        <p class="til"><i class="iconfont icon-xiugai2"></i>修改</p>
        <el-form :label-position="labelPosition" :rules="rules" label-width="80px" :model="formLabelAlign">
          <el-form-item label="部门全称" prop="name">
            <el-input v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="部门简称">
            <el-input v-model="formLabelAlign.displayName"></el-input>
          </el-form-item>
          <el-form-item label="部门编码">
            <el-input v-model="formLabelAlign.deptNum" disabled></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" size="small" @click="editBtn">确定修改</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
let id = 1000;
import { axiosPost, axiosGet } from '@/api/index.js'
import addDepForm from '../commponents/addDepForm.vue'
export default {
  data() {
    // 验证表单
    var validateUname = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('输入不能为空'))
      } else {
        if (value !== '') {
          var reg = /^[A-Za-z0-9\u4e00-\u9fa5]{2,255}$/
          if (!reg.test(value)) {
            callback(new Error('部门名称长度为2-255位'))
          }
        }
        callback()
      }
    }
    const data = []
    return {
      addVisible: false, // 添加用户弹窗控制
      data: JSON.parse(JSON.stringify(data)),
      data: JSON.parse(JSON.stringify(data)),
      labelPosition: 'right',
      formLabelAlign: {
        displayName: '机场股份公司',
        name: '首都机场股份公司',
        deptNum: '62'
      },
      isShow: false,
      addDicForm: { // 添加用户表单输入
        name: null,
        deptNum: '',
        parentDeptNum: '',
        topNodeCode: '',
        displayName: '',
        description: ''
      },
      type: '0', // 添加/修改 状态
      parentDeptNum: '',
      topNodeCode: '',
      id: '',
      rules: { // 添加字典-验证
        name: [
          { required: true, validator: validateUname, trigger: 'blur' }
        ],
        deptNum: [
          { required: true, message: '输入不能为空', trigger: 'blur' }
        ]
      },
      formLabelWidth: '120px', // 添加用户输入框宽度
    }
  },
  created () {
    this.addDepartment()
  },
  components: {
    'add-depfrom' : addDepForm
  },
  methods: {
    append(data) {
      this.addVisible = true
      this.parentDeptNum = data.deptNum
      this.topNodeCode = data.topNodeCode
      if (this.addDicForm.name != null) {
        const newChild = { id: id++, label: this.addDicForm.name, children: [] };
        if (!data.children) {
          this.$set(data, 'children', [])
        }
        data.children.push(newChild)
      }
    },
    edit (data) {
      console.log(data)
      this.type = '1'
      this.id = data.id
      this.parentDeptNum = data.parentDeptNum
      this.topNodeCode = data.topNodeCode
    },
    editBtn () {
      axiosPost('base/dept/addOrUpdateDept', {
        id: this.id,
        name: this.formLabelAlign.name,
        parentDeptNum: this.parentDeptNum,
        topNodeCode: this.topNodeCode,
        displayName: this.formLabelAlign.displayName,
        description: this.formLabelAlign.description
      }).then(result => {
        if (result.code === 200) {
          this.$message('修改成功')
          // 关闭弹窗
          this.hidePanel()
        } else {
          this.$message(result.message)
        }
        // console.log(result.data)
        // this.tableData = result.data
      })
    },
    // 删除
    remove(node, data) {
      this.$confirm('确认删除？')
      .then (_ => {
        axiosPost('base/dept/deleteDept', data.id).then(result => {
          if (result.code === 200) {
            const parent = node.parent
            const children = parent.data.children || parent.data
            const index = children.findIndex(d => d.id === data.id)
            children.splice(index, 1)
            this.$message('删除成功！')
          } else {
            this.$message(result.message)
          }
        })
        done ()
      })
      .catch (_ => {})
    },

    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
          <span>
            <el-button size="mini" type="text" on-click={ () => this.append(data) }>Append</el-button>
            <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>Delete</el-button>
          </span>
        </span>);
    },
    linkData (data) {
      this.type = '0'
      console.log(data)
      this.formLabelAlign = data
    },
    // 请求接口，获取部门结构数据
    addDepartment () {
      axiosGet('base/dept/tree').then(res => {
        console.log(res.data)
        this.data = res.data
      })
    },
    // 添加部门确定
    addDicSave (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          axiosPost('base/dept/addOrUpdateDept', {
            name: this.addDicForm.name,
            parentDeptNum: this.parentDeptNum,
            topNodeCode: this.topNodeCode,
            displayName: this.addDicForm.displayName,
            description: this.addDicForm.description
          }).then(result => {
            if (result.code === 200) {
              this.$message('添加成功')
              // 关闭弹窗
              this.hidePanel()
            } else {
              this.$message(result.message)
            }
            // console.log(result.data)
            // this.tableData = result.data
          })
        }
      })

    },
    // 取消按钮关闭弹窗
    hidePanel () {
      this.addVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  .el-tree-node__content {
    .icon {
      margin-left: 10px;
      display: none;
      .el-button--text {
        color: #999;
      }
    }
  }
  .el-tree-node__content:hover {
    .icon {
      display: inline;
    }
  }
  .til {
    font-size: 16px;
    margin-bottom: 20px;
  }
  .main-left {
    width: 300px;
    border: 1px #ebeef5 solid;
    padding: 10px;
    margin-right: 20px;
    .bmicon {
      color: #004EA2;
      margin-right: 10px;
    }
  }
  .main-right {
    width:70%;
    border: 1px #ebeef5 solid;
    .til {
      background: #E6ECF1;
      line-height: 40px;
      padding: 0 20px;
      .iconfont {
        margin-right: 10px;
        color: #004EA2;
      }
    }
    .el-form {
      padding: 0 20px 0 10px;
    }
  }
}

.el-dialog {
  width: 30%;
}
.el-form-item {
	margin-bottom: 15px;
}

</style>
