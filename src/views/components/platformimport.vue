<!--
 * @Description: 批量导入
 * @Version:
 * @Autor: louisyi
 * @Date: 2019-09-04 17:29:11
 * @LastEditors: louisyi
 * @LastEditTime: 2019-09-26 10:27:36
 -->
<template>
  <div class="platformimport">
    <el-collapse class="common-collapse"
                 v-model="currentCollapse">
      <el-collapse-item v-if="!isHistory"
                        name="2"
                        disabled
                        class="active">
        <template slot="title">
          <div class="collapse-title">批量导入</div>
        </template>
        <el-row>
          <el-col>
            <el-form-item label="选择文件"
                          prop="file"
                          class="select-file">
              <el-upload ref="template"
                         class="upload-file"
                         :before-upload="beforeTemplateUpload"
                         :action="importTemplateUrl"
                         :on-preview="handleTemplatePreview"
                         :on-remove="handleTemplateRemove"
                         :before-remove="templatebeforeRemove"
                         :file-list="formData.file"
                         :on-success="templateImportSuccess"
                         :on-error="templateImportError"
                         :limit="1"
                         :on-exceed="handleTemplateExceed"
                         :headers="headers"
                         accept=".xlsx,.xls"
                         :disabled=" disable || callFlag"
                         :auto-upload="false">
                <el-button :disabled=" disable || callFlag"
                           slot="trigger"
                           size="small"
                           height="28px"
                           class="primary-btn"
                           type="primary"
                           @click="getTemplate">浏览
                </el-button>
                <el-button size="small"
                           height="28px"
                           class="primary-btn template-upload"
                           @click="submitTemplateUpload"
                           :disabled="mutual=='add' || callFlag || !importFlag">导入
                </el-button>
              </el-upload>
            </el-form-item>
            <el-button size="small"
                       @click="getClickedTemplate()"
                       :disabled="callFlag"
                       class="download">下载模板
            </el-button>
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { importTemplateUrl, getTemplateList } from '@/api/swApi.js'
import { axiosGet, constApi } from '@/api/index.js'
import dayjs from 'dayjs'
export default {
  props: {
    isHistory: Boolean,
    callFlag: Boolean,
    formData: {},
    disable: Boolean // 当列表导入数据后不允许通过excel导入
  },
  data () {
    return {
      tableData: [],
      importTemplateUrl,
      mutual: '',
      importFlag: false,
      constApi: constApi,
      currentCollapse: ['1', '2'],
      templateList: []
    }
  },
  computed: {
    headers () {
      return {
        token: localStorage.getItem('token')
      }
    }
  },
  mounted () {
    this.getTemplateList()
  },
  methods: {
    // 上传模板之前
    beforeTemplateUpload (file) {
      this.tableData = []
    },
    handleTemplatePreview () {

    },
    handleTemplateRemove (file, fileList) {
      this.tableData = []
    },
    templatebeforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
    },
    // 导入模板成功
    templateImportSuccess (response, file, filelist) {
      var _this = this
      if (response.code === 200) {
        _this.formData.file = filelist
        _this.tableData = response.data.equipList
        let date = dayjs(Date.now()).format('YYYY-MM-DD')
        _this.tableData.forEach(e => {
          this.$set(e, 'handleAmount', 0)
          this.$set(e, 'handleTime', date)
        })

        this.$emit('getDataList', _this.tableData)
      } else if (response.code === 500) {
        this.$alert(response.data[0], '错误', {
          confirmButtonText: '确定',
          callback: action => {
          }
        })
      } else {
        this.$message.error(response.message)
      }
    },
    templateImportError (response, file, filelist) {
      this.$message.error(`导入失败`)
    },
    handleTemplateExceed (files, fileList) {
      this.$refs.template.clearFiles()
    },
    getTemplate () {
      // this.mutual = 'import'
      // if (this.mutual === 'add') return
      this.$refs.template.clearFiles()
      this.importFlag = true
    },
    submitTemplateUpload () {
      this.$refs.template.submit()
      this.tableData = []
    },
    // 获取模板列表
    getTemplateList () {
      getTemplateList().then((res) => {
        if (res.code === 200) {
          this.templateList = res.data
        }
      })
    },
    // 选择单个模板进行下载
    getClickedTemplate () {
      var _this = this
      if (_this.templateList.length > 0) {
        var url = _this.templateList[0].url
      }
      var loading = this.$loading({
        lock: true,
        text: '下载中，请稍后...',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      axiosGet(url).then(result => {
        if (result.code === 200) {
          window.location.href = _this.constApi + result.data
          loading.close()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.platformimport {
  .collapse-title {
    flex: 1 0 90%;
    order: 1;
  }

  .primary-btn.el-button {
    background: #3a8eff;
    color: #fff;
    border-color: #fff !important;
  }

  .download.el-button {
    background: #004ea2;
    color: #fff;
  }

  .template-upload {
    height: 32px;
    margin-left: 10px;
  }
}
</style>
