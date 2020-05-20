<!--
 * @Description: 抽盘结束抽盘弹框
 * @Version:
 * @Autor: louisyi
 * @Date: 2019-09-24 09:46:34
 * @LastEditors: louisyi
 * @LastEditTime: 2019-10-10 15:03:24
 -->
<template>
  <div class="randomTaskDialog">
    <el-dialog title="上传报告"
               :visible.sync="dialogVisible">

      <el-upload :action="filelUrl"
                 :headers="headers"
                 :before-upload="startUpload"
                 :before-remove="beforeRemove"
                 v-loading="uploadLoading"
                 multiple
                 :limit="3"
                 drag
                 :on-exceed="handleExceed"
                 :on-success="uploadSucess"
                 :file-list="fileList">

        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <!-- <div class="el-upload__tip"
             slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
      </el-upload>

    </el-dialog>
  </div>
</template>

<script>
import { filelUrl } from '@/api/commonApi'
import { endExtractTask } from '@/api/swInventory.js'
export default {
  data () {
    return {
      filelUrl, // 上传url
      headers: {
        token: localStorage.getItem('token') // 上传token
      },
      formData: { // 上传入参
        deptNum: '',
        fileType: this.pageType,
        fileTitle: ''
      },
      fileList: [], // 上传文件列表

      uploadLoading: false // 上传状态
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    extractId: String
  },
  watch: {
    dialogVisible () {
      if (this.dialogVisible) {
      }
    }
  },

  computed: {
    dialogVisible: {
      get () {
        return this.value
      },
      set () {
        this.$emit('input', false)
      }
    }
  },
  mounted () {
  },
  methods: {

    startUpload () {
      this.uploadLoading = true
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    // 结束抽盘任务
    endExtractTask (url) {
      endExtractTask({
        extractId: this.extractId,
        downloadUrl: url
      }).then((res) => {
        if (res.code === 200) {
          this.$emit('update')
          this.$message({
            type: 'success',
            message: '结束抽盘任务成功!'
          })
        } else {
          this.$message({
            type: 'error',
            message: '抽盘数量不能为0!'
          })
        }
      })
    },
    uploadSucess (res) {
      if (res.code === 200) {
        this.uploadLoading = false
        this.$emit('getFileListByType')
        this.endExtractTask(res.data[0].downloadUrl)
        this.fileList = []
        this.formData.fileTitle = ''
        this.handlePopClose()
      }
    },
    handlePopClose () {
      this.dialogVisible = false
    }
  }
}
</script>
