<!--
 * @Description: 文件上传组件
 * @Version:
 * @Autor: louisyi
 * @Date: 2019-09-08 15:48:15
 * @LastEditors: louisyi
 * @LastEditTime: 2019-09-23 20:29:24
 -->
<template>
  <div class="uploadDiaglog">
    <el-dialog :title="title"
               :visible.sync="addPopDialog"
               width="50%"
               :before-close="handlePopClose">
      <div style="min-height:300px">
        <el-form label-position="left"
                 ref="ruleForm"
                 :rules="rules"
                 label-width="80px"
                 :model="formData">
          <el-form-item label="上传部门:">
            <el-input v-model="formData.deptName"
                      :disabled="true"
                      style="width:180px"></el-input>
          </el-form-item>
          <el-form-item label="设备标题:"
                        prop="fileTitle">
            <el-input v-model.trim="formData.fileTitle"
                      style="width:180px"></el-input>
          </el-form-item>
          <el-form-item label="上传文件:">
            <el-upload :action="filelUrl"
                       :on-preview="handlePreview"
                       :headers="headers"
                       :data="formData"
                       :on-remove="handleRemove"
                       :before-upload="startUpload"
                       :before-remove="beforeRemove"
                       v-loading="uploadLoading"
                       multiple
                       :limit="3"
                       :on-exceed="handleExceed"
                       :on-success="uploadSucess"
                       :disabled="isUplaod"
                       :file-list="fileList">
              <el-button size="small"
                         :disabled="isUplaod"
                         type="primary">点击上传</el-button>
              <!-- <div slot="tip"
                   class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { filelUrl } from '@/api/commonApi'
export default {
  data () {
    return {
      formData: {
        deptNum: '',
        fileType: this.pageType,
        fileTitle: ''
      },
      rules: {
        fileTitle: [
          {
            required: true,
            message: '设备标题不能为空',
            trigger: 'blur'
          }, {

            max: 30,
            message: '设备标题长度为 30 个字符',
            trigger: ['blur', 'change']
          }
        ]
      },
      fileList: [],
      filelUrl,
      headers: {
        token: localStorage.getItem('token')
      },
      uploadLoading: false

    }
  },
  props: {
    pageType: {
      default: 'DOCUMENT',
      type: String
    },
    value: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    title () {
      return this.pageType === 'DOCUMENT' ? '上传文挡' : '上传驱动'
    },
    isUplaod () {
      return this.formData.fileTitle === ''
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
  mounted () {
    this.init()
  },
  methods: {
    init () {
      let user = JSON.parse(localStorage.getItem('user'))
      this.formData.deptNum = user.deptNum
      this.formData.deptName = user.deptName
    },
    startUpload () {
      this.uploadLoading = true
    },
    handlePopClose () {
      this.addPopDialog = false
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
    uploadSucess () {
      this.uploadLoading = false
      this.$emit('getFileListByType')
      this.$message.success('上传文件成功！')
      this.fileList = []
      this.formData.fileTitle = ''
      this.handlePopClose()
    },

    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    }
  }
}
</script>

<style>
</style>
