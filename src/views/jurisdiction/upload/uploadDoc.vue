<!--
 * @Description: 上传文件=》上传文档
 * @Version:
 * @Autor: louisyi
 * @Date: 2019-09-08 15:22:02
 * @LastEditors: louisyi
 * @LastEditTime: 2019-09-23 17:23:56
 -->
<template>
  <div class="uploadDoc">
    <div class="form-title">
      <i class="icon"></i>{{title}}
    </div>

    <el-collapse class="common-collapse common-fold common-table mt10"
                 v-model="currentCollapse">
      <el-collapse-item name="1"
                        class="active">
        <template slot="title">
          <div class="collapse-title">上传文件列表</div>
        </template>

        <div class=" mb10">

          <el-button type="primary"
                     size="small"
                     @click="addPopDialogOpen">上 传</el-button>
        </div>

        <el-table :data="tableData"
                  border
                  v-loading="loading">
          <el-table-column :show-overflow-tooltip='true'
                           type="index"
                           width="55"
                           label="序号"></el-table-column>
          <el-table-column :show-overflow-tooltip='true'
                           prop="fileTitle"
                           label="设备标题"></el-table-column>
          <el-table-column :show-overflow-tooltip='true'
                           prop="fileName"
                           label="文件名称"></el-table-column>
          <el-table-column :show-overflow-tooltip='true'
                           prop="createdate"
                           label="上传日期"></el-table-column>
          <el-table-column :show-overflow-tooltip='true'
                           label="排序">
            <template slot-scope="scope">
              <span>{{scope.row.sortNum}}</span>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip='true'
                           label="操作">
            <template slot-scope="scope">
              <el-button size="mini"
                         @click="selectFile(scope.row)"
                         type="primary"
                         plain>编辑</el-button>
              <el-button size="mini"
                         @click.native="delFile(scope.row.id,scope.$index)"
                         type="danger"
                         plain>删除</el-button>
            </template>
          </el-table-column>

        </el-table>
        <div class="block pagination">
          <el-pagination @current-change="handleCurrentChange"
                         :current-page.sync="currentPage"
                         :page-size="pageSize"
                         background
                         layout="total, prev, pager, next, jumper"
                         :total="pageCount">
          </el-pagination>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-dialog title="修改文件排序"
               :visible.sync="editFileDialog"
               :close-on-click-modal="false"
               width="30%"
               :before-close="editFileClose">
      <div style="min-height:300px">
        <el-form ref="ruleForm"
                 :model="formData"
                 :inline="true">
          <el-form-item label="排序"
                        label-width="80px"
                        prop="sortNum"
                        :rules="[
      { required: true, message: '排序不能为空'},
      { type: 'number', message: '排序必须为数字值'}
    ]">

            <el-input-number v-model="formData.sortNum"
                             controls-position="right"
                             @change="handleChange"
                             :min="1"
                             :max="99999999">
            </el-input-number>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       size="small"
                       @click.stop="saveInfo()">设 置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <uploadDiaglog v-model="addPopDialog"
                   :pageType="pageType"
                   @getFileListByType="getFileListByType"></uploadDiaglog>
  </div>
</template>

<script>
import uploadDiaglog from '../commponents/uploadDiaglog'
import { getFileListByType, updateFile } from '@/api/swApi'
export default {
  props: {
    pageType: {
      default: 'DOCUMENT',
      type: String
    }
  },
  data () {
    return {
      currentCollapse: ['1', '2'],
      loading: false,
      tableData: [],
      // 默认显示第几页
      currentPage: 1,
      // 默认每页显示的条数（可修改）
      pageSize: 10,
      pageCount: 0,
      addPopDialog: false,
      editFileDialog: false,
      formData: {
        sortNum: 0
      },
      selectInfo: ''
    }
  },
  components: {
    uploadDiaglog
  },
  mounted () {
    this.getFileListByType()
  },
  computed: {
    title () {
      return this.pageType === 'DOCUMENT' ? '上传文挡' : '上传驱动'
    }
  },
  methods: {
    addPopDialogOpen () {
      this.addPopDialog = !this.addPopDialog
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getFileListByType()
    },
    // 获取数据
    getFileListByType () {
      let params = {
        fileType: this.pageType,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }
      getFileListByType(params).then((res) => {
        if (res.code === 200) {
          this.tableData = res.data.records
          this.pageCount = res.data.total
        }
      })
    },
    selectFile (row) {
      this.selectInfo = row
      this.formData.sortNum = row.sortNum
      this.editFileDialog = true
    },
    // 编辑排序
    saveInfo () {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          updateFile({
            id: this.selectInfo.id,
            sortNum: this.formData.sortNum
          }).then((res) => {
            if (res.code === 200) {
              this.getFileListByType()
              this.editFileDialog = false
              this.$message.success('设置成功！')
            } else {
              this.$message.error('设置失败！')
            }
          })
        }
      })
    },
    editFileClose () {
      this.editFileDialog = false
      this.formData.sortNum = 0
    },
    // 删除文件
    delFile (id, index) {
      let params = {
        id: id,
        isDelete: '1'
      }
      this.$confirm('确认删除?').then(() => {
        updateFile(params).then((res) => {
          if (res.code === 200) {
            this.tableData.splice(index, 1)
            this.$message.success('删除成功！')
          } else {
            this.$message.error('删除失败！')
          }
        })
      }).catch(() => { })
    },
    handleChange () {

    }
  }
}
</script>

<style>
</style>
