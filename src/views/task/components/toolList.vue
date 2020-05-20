<!--
 * @Description: 工具下载公共页面
 * @Version:
 * @Autor: louisyi
 * @Date: 2019-09-08 19:54:03
 * @LastEditors: louisyi
 * @LastEditTime: 2019-09-09 21:12:40
 -->
<template>
  <div class="toolList">
    <div class="form-title">
      <i class="icon"></i>{{title}}
    </div>
    <el-collapse class="common-collapse common-fold common-table mt10"
                 v-model="currentCollapse">
      <el-collapse-item name="1"
                        class="active">
        <template slot="title">
          <div class="collapse-title">
            <span>工具列表</span>

          </div>

        </template>

        <el-table :data="tableData"
                  border
                  v-loading="loading">
          <el-table-column :show-overflow-tooltip='true'
                           type="index"
                           width="55"
                           label="序号"></el-table-column>
          <el-table-column :show-overflow-tooltip='true'
                           prop="fileTitle"
                           label="标题"></el-table-column>
          <el-table-column :show-overflow-tooltip='true'
                           prop="deptName"
                           label="发布部门"></el-table-column>
          <el-table-column :show-overflow-tooltip='true'
                           prop="createdate"
                           label="发布时间"></el-table-column>
          <el-table-column :show-overflow-tooltip='true'
                           label="操作">
            <template slot-scope="scope">
              <el-button size="mini"
                         @click="fileDown(scope.row)"
                         type="primary"
                         plain>下载</el-button>

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
  </div>
</template>

<script>
import { getFileListByType } from '@/api/swApi'
import { axiosGet, constApi } from '@/api/index.js'

export default {
  props: {
    pageType: {
      default: 'DOCUMENT',
      type: String
    }
  },
  data () {
    return {
      currentCollapse: ['1'],
      loading: false,
      tableData: [],
      // 默认显示第几页
      currentPage: 1,
      // 默认每页显示的条数（可修改）
      pageSize: 10,
      pageCount: 0
    }
  },
  mounted () {
    this.getFileListByType()
  },
  computed: {
    title () {
      return this.pageType === 'DOCUMENT' ? '文挡下载' : '驱动下载'
    }
  },
  methods: {
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
    handleCurrentChange (val) {
      this.currentPage = val
      this.getFileListByType()
    },
    // 文件下载
    fileDown (row) {
      if (!row.downloadUrl) {
        this.$message.error(`文件下载地址为空，不可以下载！`)
        return
      }
      let loading = this.$loading({
        lock: true,
        text: '下载中，请稍后...',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      axiosGet(row.downloadUrl).then(result => {
        if (result.code === 200) {
          window.location.href = constApi + result.data
          loading.close()
        }
      })
    }
  }

}
</script>

<style>
</style>
