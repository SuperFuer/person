<!--
 * @Description:
 * @Version:
 * @Autor: louisyi
 * @Date: 2019-09-07 11:01:25
 * @LastEditors: louisyi
 * @LastEditTime: 2019-09-10 09:57:00
 -->
<template>
  <div class="common-table">
    <div class="form-title">
      <i class="icon"></i>日志导出
    </div>

    <el-form :inline="true"
             :model="searchInput"
             class="ml10">
      <el-form-item label="开始日期:">
        <el-date-picker v-model="searchInput.startDate"
                        type="date"
                        :clearable="false"
                        value-format="yyyy-MM-dd"
                        placeholder="开始日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束日期:"
                    class="ml30">
        <el-date-picker v-model="searchInput.endDate"
                        type="date"
                        :clearable="false"
                        value-format="yyyy-MM-dd"
                        placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   size="small"
                   @click.stop="getLogList()">搜 索</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="formData"
              border
              v-loading="loading">
      <el-table-column :show-overflow-tooltip='true'
                       label="序号"
                       width="55"
                       type="index"></el-table-column>
      <el-table-column :show-overflow-tooltip='true'
                       prop="fileName"
                       label="文件名称"></el-table-column>
      <el-table-column :show-overflow-tooltip='true'
                       prop="createDate"
                       label="日期"></el-table-column>
      <el-table-column :show-overflow-tooltip='true'
                       label="操作">
        <template slot-scope="scope">
          <el-button size="mini"
                     @click="exortExcel(scope.row)"
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
  </div>
</template>
<script>
import { getLogList } from '@/api/swApi'
import dayjs from 'dayjs'
import { axiosGet, constApi } from '@/api/index.js'
export default {
  data () {
    return {
      searchInput: {
        startDate: dayjs(Date.now()).format('YYYY-MM-DD'),
        endDate: dayjs(Date.now()).format('YYYY-MM-DD')
      },
      selectOption: [],
      value: '',
      formData: [],
      loading: false,
      currentPage: 1,
      // 默认每页显示的条数（可修改）
      pageSize: 10,
      pageCount: 0
    }
  },
  created () {

  },
  mounted () {
    this.getLogList()
  },
  methods: {
    // 获取列表数据加载
    getLogList () {
      if (dayjs(this.searchInput.startDate).isAfter(dayjs(this.searchInput.endDate))) {
        this.$message.error('结束时间必须大于开始时间！')
        return
      }
      getLogList(this.searchInput).then((res) => {
        if (res.code === 200) {
          this.formData = res.data
        }
      })
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getLogList()
    },
    exortExcel (row) {
      if (dayjs(this.searchInput.startDate).isAfter(dayjs(this.searchInput.endDate))) {
        this.$message.error('结束时间必须大于开始时间！')
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
<style lang="scss" scoped>
</style>
