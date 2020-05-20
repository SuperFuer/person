<!--
 * @Description: 盘点=>生成盘点任务弹框
 * @Version:
 * @Autor: louisyi
 * @Date: 2019-09-20 15:27:41
 * @LastEditors: louisyi
 * @LastEditTime: 2019-10-11 14:44:56
 -->
<template>
  <div class="inventoryAdminDialog">
    <!-- 生成盘点单：弹窗部分 -->
    <el-dialog title="生成盘点任务"
               :visible.sync="dialogVisible"
               width="50%"
               height="80%">
      <el-form ref="ruleForm"
               :model="searchInput"
               :rules="rules">
        <el-row class="common-row">
          <el-col :span="12">
            <el-form-item label="盘点名称"
                          prop="name"
                          label-width="120px">
              <el-input class="add"
                        v-model.trim="searchInput.name"></el-input>

            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="盘点年度"
                          prop="inventoryYear"
                          label-width="120px">
              <el-date-picker v-model="searchInput.inventoryYear"
                              type="year"
                              class="add"
                              value-format="yyyy"
                              placeholder="选择年">
              </el-date-picker>
              <!-- <el-select v-model="searchInput.inventoryYear"
                         placeholder="请选择"
                         class="add">
                <el-option v-for="item in yearList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="common-row row-list el-row">
          <el-col :span="12">
            <el-form-item label="开始时间"
                          prop="startTime"
                          label-width="120px">
              <el-date-picker v-model="searchInput.startTime"
                              type="date"
                              :picker-options="startTime"
                              :clearable="false"
                              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间"
                          prop="endTime"
                          label-width="120px">
              <el-date-picker v-model="searchInput.endTime"
                              type="date"
                              :picker-options="endTime"
                              :clearable="false"
                              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="common-row row-list el-row">
          <el-col :span="12">
            <el-form-item label="截止日期"
                          prop="deadline"
                          label-width="120px">
              <el-date-picker v-model="searchInput.deadline"
                              type="date"
                              :picker-options="deadTime"
                              :clearable="false"
                              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="盘点部门"
                          prop="deptList"
                          label-width="120px">
              <el-input class="add"
                        v-model="deptNameList"
                        @focus="dialogShow=true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button size="small"
                   @click="dialogVisible = false">取 消</el-button>
        <el-button size="small"
                   type="primary"
                   :disabled="loading"
                   @click="addInventory('ruleForm')">确认生成</el-button>
      </span>
    </el-dialog>
    <selectDept v-model="dialogShow"
                @getCheckedDept="getCheckedDept"></selectDept>
  </div>
</template>

<script>
import selectDept from '@/components/selectDept'
import { addInventory } from '@/api/swInventory.js'
import dayjs from 'dayjs'
export default {
  data () {
    return {
      dialogParticipation: false, // 盘点部门弹窗控制
      value1: '',
      selectYear: '',
      yearList: [{
        value: '2019',
        label: '2019'
      }],
      startTime: { /* start 开始时间小于今天,结束时间不能大于开始时间 */
        disabledDate: (time) => {
          let beginDateVal = this.searchInput.endTime
          if (beginDateVal) {
            return time.getTime() > beginDateVal
          } else {
            return time.getTime() < dayjs(Date.now()).subtract(1, 'day').valueOf()
          }
        }
      },
      endTime: {
        disabledDate: (time) => {
          let beginDateVal = this.searchInput.startTime
          if (beginDateVal) {
            return time.getTime() < beginDateVal
          }
        }
      },
      deadTime: {
        disabledDate: (time) => {
          return time.getTime() >= Date.now()
        }
      },
      searchInput: {
        name: '',
        inventoryYear: '',
        startTime: '',
        endTime: '',
        deptList: [],
        deadline: ''

      },
      dialogShow: false,
      rules: {
        name: {
          required: true,
          message: '盘点名称不能为空',
          trigger: 'blur'
        },
        inventoryYear: {
          required: true,
          message: '盘点年度不能为空',
          trigger: ['blur', 'change']
        },
        startTime: {
          required: true,
          message: '开始时间不能为空',
          trigger: ['blur', 'change']
        },
        endTime: {
          required: true,
          message: '结束时间不能为空',
          trigger: ['blur', 'change']
        },
        deadline: {
          required: true,
          message: '设备生成截止日期不能为空',
          trigger: ['blur', 'change']
        },
        deptList: {
          required: true,
          message: '盘点部门不能为空',
          trigger: ['blur', 'change']
        }
      },
      loading: false
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  components: {
    selectDept
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
    },
    deptNameList () {
      let names = this.searchInput.deptList.map(e => e.name)
      return names.join(',')
    }
  },
  methods: {
    // 部门选择
    getCheckedDept (data) {
      // this.searchInput.deptList = data.map((e) => {
      //   return e.deptNum
      // })
      let arr = []
      data.forEach(e => {
        let a = {}
        a.deptNum = e.deptNum
        a.name = e.name
        arr.push(a)
      })
      this.searchInput.deptList = arr
    },
    // 新增盘点任务
    addInventory (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          this.searchInput.startTime = dayjs(this.searchInput.startTime).format('YYYY-MM-DD')
          this.searchInput.endTime = dayjs(this.searchInput.endTime).format('YYYY-MM-DD')
          addInventory(this.searchInput).then((res) => {
            this.loading = false
            if (res.code === 200) {
              this.dialogVisible = false
              // 刷新列表
              this.$emit('updateList')
              this.$message({
                message: '操作成功！',
                type: 'success'
              })
            } else {
              this.$message({
                message: res.message,
                type: 'error'
              })
            }
          })
        }
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.inventoryAdminDialog {
  // .add {
  //   width: 210px;
  // }

  .common-row {
    margin: 15px 0;
  }

  /deep/ .el-input__inner {
    padding-left: 30px;
  }
}
</style>
