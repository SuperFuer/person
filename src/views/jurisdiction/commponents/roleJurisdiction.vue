<template>
    <div>
      <!-- 权限配置-弹窗Form -->
      <el-dialog title="权限配置" :visible.sync="dialogAddUser" :before-close="hidePanel">
        <el-tree
          :data="department"
          ref="tree"
          show-checkbox
          node-key="id"
          :default-expanded-keys="[2, 3]"
          :default-checked-keys="data"
          :props="defaultProps">
        </el-tree>
        <div slot="footer" class="dialog-footer">
          <el-button @click="hidePanel" size="small">取 消</el-button>
          <el-button type="primary" @click="departmentOk" size="small">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>
<script>
import { axiosPost, axiosGet } from '@/api/index.js'
export default {
  // props: { // 弹窗显示
  //   dialogAddUser: {
  //     type: Boolean,
  //     default: false
  //   }
  // },
  props: ['dialogAddUser', 'id', 'checkList'],
  data () {
    return {
      innerVisible: false, // 权限配置弹出显示
      ment: null, // 权限配置
      department: [], // 权限结构树
      defaultProps: {
        children: 'childMenu',
        label: 'name'
      },
      jurisd: [],
      data: []
    }
  },
  mounted () {
    // this.jurisdiction()
    this.getMenus()
    
    // 获取设置过的权限
    this.data = JSON.parse(localStorage.getItem('jurisd')) || []
  },
  methods: {
    // 取消按钮关闭弹窗
    hidePanel () {
      this.$emit('update:dialogAddUser', false)
    },
    // 请求接口，获取权限结构数据
    getMenus(context,arg){
      axiosGet('base/api/getMenu').then(res => {
        if (res.code === 200) {
          this.department = res.data
          // console.log(res.data)
        }
      })
    },
    // 选择权限-确定
    departmentOk () {
      let res = this.$refs.tree.getCheckedNodes()
      // console.log(res)
      res.forEach(item => {
        this.jurisd.push(item.id)
      })
      // 本地存储勾选中的权限
      localStorage.setItem('jurisd', JSON.stringify(this.jurisd))
      // 遍历获取选择子集所属菜单id
      this.department.forEach(v1 => {
        if(v1.childMenu.length > 0) {
          v1.childMenu.forEach(v2 => {
            if(v2.childMenu.length > 0) {
              v2.childMenu.forEach(v3 => {
                if (v3.childMenu.length > 0) {
                  v3.childMenu.forEach(v4 => {
                    res.forEach(item => {
                      if (item.id === v2.id || item.id === v3.id || item.id === v4.id) {
                        this.jurisd.push(v1.id)
                        this.jurisd.push(v2.id)
                        this.jurisd.push(v3.id)
                      }
                    })
                  })
                } else {
                  res.forEach(item => {
                    if (item.id === v2.id) {
                      this.jurisd.push(v1.id)
                    }
                  })
                }
              })
            }
          })
        }
      })
      // 数据去重
      this.jurisd = [...new Set(this.jurisd)]
      axiosPost('base/role/add-apis', {
        roleId: this.id,
        apiIds: this.jurisd
      }).then(result => {
        if (result.code === 200) {
          this.$message('配置成功')
          // 关闭弹窗
          this.hidePanel()
        } else {
          this.$message('配置失败！')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-dialog__body {
    padding: 20px 30px;
  }
  .ment-input {
    width: 200px;
    height: 30px;
    position: absolute;
    top: 0;
  }
</style>
