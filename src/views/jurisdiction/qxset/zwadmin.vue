<template>
  <div class="custom-tree-container">
    <div class="form-title"><i class="icon"></i>职位设置</div>
    <div class="zwmain">
      <div class="block">
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText"
          class="fil-input">
        </el-input>
        <el-tree
          :data="data"
          node-key="id"
          default-expand-all
          :filter-node-method="filterNode"
          ref="tree"
          :expand-on-click-node="false">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span @click="linkData(data)">
              <i class="iconfont icon-xingming1"></i>
              {{ data.name }}
            </span>
            <span class="icon">
              <el-button
                type="text"
                size="mini"
                @click="() => append(data)"
                >
                <el-button type="primary" size="mini" class="zw-btn" plain>新增下级</el-button>
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="() => edit(data)"
                >
                <el-button type="success" size="mini" class="zw-btn" plain>编辑</el-button>
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="() => remove(node, data)">
<!--                <el-button type="danger" size="mini" class="zw-btn" v-if="data.children.length > 0 ? isShow : !isShow">删除</el-button>-->
                <i class="iconfont icon-icon" v-if="data.children.length > 0 ? isShow : !isShow"></i>
              </el-button>
            </span>
          </span>
        </el-tree>
      </div>
      <!-- 添加职位-弹窗Form -->
      <el-dialog title="添加职位" :visible.sync="addVisible" :before-close="hidePanel">
        <el-form :model="addDicForm" :rules="rules" ref="addDicForm">
          <el-form-item label="职位名称:" :label-width="formLabelWidth" prop="name">
            <el-input v-model="addDicForm.name" ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="addDicSave('addDicForm')" size="small">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 修改职位-弹窗Form -->
      <el-dialog title="修改职位" :visible.sync="editVisible" :before-close="hidePanel">
        <el-form :model="editPosForm" :rules="rules" ref="editPosForm">
          <el-form-item label="职位名称:" :label-width="formLabelWidth" prop="name">
            <el-input v-model="editPosForm.name" ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="editBtn" size="small">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
let id = 1000
import { axiosPost, axiosGet } from '@/api/index.js'
export default {
  data() {
    // 验证表单
    var validateUname = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('输入不能为空'))
      } else {
        if (value !== '') {
          var reg = /^[A-Za-z0-9\u4e00-\u9fa5]{2,20}$/
          if (!reg.test(value)) {
            callback(new Error('职位名称长度为2-20位'))
          }
        }
        callback()
      }
    }
    const data = []
    return {
      filterText: '', // 过滤
      addVisible: false, // 添加职位弹窗控制
      editVisible: false, // 修改职位弹窗控制
      data: JSON.parse(JSON.stringify(data)),
      data: JSON.parse(JSON.stringify(data)),
      labelPosition: 'right',
      editPosForm: {
        name: ''
      },
      isShow: false,
      addDicForm: { // 添加用户表单输入
        name: '',
      },
      type: '0', // 添加/修改 状态
      parentDeptNum: '',
      topNodeCode: '',
      id: '',
      parentId: '',
      rules: { // 添加职位-验证
        name: [
          { required: true, validator: validateUname, trigger: 'blur' }
        ]
      },
      formLabelWidth: '120px', // 添加用户输入框宽度
    }
  },
  created () {
    this.addDepartment()
  },
  watch: {
    // 过滤
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    // 过滤
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 添加弹窗控制
    append (data) {
      this.addVisible = true
      this.id = data.id
    },
    // 编辑弹窗控制
    edit (data) {
      this.editVisible = true
      this.type = '1'
      this.id = data.id
      this.parentId = data.parentId
      this.editPosForm.name = data.name
    },
    // 请求接口，获取部门结构数据
    addDepartment () {
      axiosGet('base/position/tree').then(res => {
        console.log(res.data)
        this.data = res.data
      })
    },
    // 添加部门确定
    addDicSave (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          axiosPost('base/position/addOrUpdatePosition', {
            name: this.addDicForm.name,
            parentId: this.id
          }).then(result => {
            if (result.code === 200) {
              this.$message('添加成功')
              // 关闭弹窗
              this.hidePanel()
            } else {
              this.$message(result.message)
            }
          })
        }
      })
    },
    // 修改确定
    editBtn () {
      axiosPost('base/position/addOrUpdatePosition', {
        parentId: this.parentId,
        id: this.id,
        name: this.editPosForm.name
      }).then(result => {
        if (result.code === 200) {
          this.$message('修改成功')
          // 关闭弹窗
          this.hidePanel()
        } else {
          this.$message(result.message)
        }
      })
    },
    // 删除
    remove (node, data) {
      this.$confirm('确认删除？').then(_ => {
        axiosPost('base/position/deletePosition', data.id).then(result => {
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
      }).catch (_ => {})
    },
    renderContent (h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
          <span>
            <el-button size="mini" type="text" on-click={ () => this.append(data) }>Append</el-button>
            <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>Delete</el-button>
          </span>
        </span>)
    },
    linkData (data) {
      this.type = '0'
      console.log(data)
      this.formLabelAlign = data
    },
    // 关闭弹窗
    hidePanel () {
      this.addVisible = false
      this.editVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.zwmain {
  border: 1px #DCDFE6 solid;
  border-radius: 3px;
  padding: 10px;
  .zw-btn {
    padding: 4px 7px;
  }
  .fil-input {
    margin: 10px 0;
    .el-input__inner {
      height: 35px!important;
      line-height: 35px!important;
    }
  }
  .el-input__inner {
    border: 1px #DCDFE6 solid;
  }
  .el-tree-node__content {
    position: relative;
    height: 35px;
    .icon {
      position: absolute;
      top: 0;
      right: 0;
      margin-right: 130px;
      margin-top: -4px;
      .iconfont {
        color: #ccc;
      }
      .el-button--text {
        color: #3A8EFF;
        .el-button--text {
          color: #999;
        }
      }
    }
  }

  .til {
    font-size: 16px;
    margin-bottom: 20px;
  }
  .main-left {
    width: 70%;
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
