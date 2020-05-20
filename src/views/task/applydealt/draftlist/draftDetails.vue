<!--
 * @Description:
 * @Version:
 * @Autor: louisyi
 * @Date: 2019-08-27 14:13:11
 * @LastEditors: louisyi
 * @LastEditTime: 2019-09-06 10:35:35
 -->
<template>
  <div>
    <!-- 验收 -->
    <acceptCheck v-if="currentType=='physicalAssetsAcceptance' || currentType == 0 "
                 :paramList="params"></acceptCheck>
    <!-- 变更 -->
    <changeCheck v-if="currentType=='physicalAssetsChange' || currentType == 1"
                 :paramList="params"></changeCheck>
    <!-- 调拨 -->
    <allocationCheck v-if="currentType=='physicalAssetsInterdepartTransfer' || currentType == 2"
                     :paramList="params"></allocationCheck>
    <!-- 借用（内部门） -->
    <bmjyapplyCheck v-if="currentType=='physicalAssetsBorrowed' || currentType == 3"
                    :paramList="params"></bmjyapplyCheck>
    <!-- 归还（内部门） -->
    <bmghapplyCheck v-if="currentType=='physicalAssetsReturned' || currentType == 4"
                    :paramList="params"></bmghapplyCheck>
    <!-- 报废管理-->
    <bfAdministration v-if="currentType=='physicalAssetsScrapDisposal' || currentType == 5"
                      :paramList="params"></bfAdministration>

    <!-- 报废处置-->
    <bfManagement v-if="currentType=='physicalAssetsScrap' || currentType == 10"
                      :paramList="params"></bfManagement>

    <!-- 启封 -->
    <unsealingPageCheck v-if="currentType=='physicalAssetsUnseal' || currentType == 6"
                        :paramList="params"></unsealingPageCheck>
    <!-- 封存 -->
    <sealingPageCheck v-if="currentType=='physicalAssetsSealUp' || currentType == 7"
                      :paramList="params"></sealingPageCheck>
    <!-- 闲置 -->
    <swInventoryCheck v-if="currentType=='physicalAssetsUnused' || currentType == 8"
                      :paramList="params"></swInventoryCheck>
    <!-- 闲置处置 -->
    <swReturnCheck v-if="currentType=='physicalAssetsIdleDisposal' || currentType == 9"
                   :paramList="params"></swReturnCheck>
    <!-- 消防车辆维修管理流程 -->
    <xfVehicleRepair v-if="currentType==100"
                   :paramList="params"></xfVehicleRepair>
    <!-- 盘点审批流程 -->
    <inventoryApply v-if="currentType=='physicalAssetsInventory' || currentType == 11"
                   :paramList="params"></inventoryApply>
  </div>
</template>
<script>
import acceptCheck from '../../../components/sbCheckApply'
import changeCheck from '../../../components/changeCheck'
import allocationCheck from '../../../components/allocation'
import bmjyapplyCheck from '../../../components/bmjyApply'
import bmghapplyCheck from '../../../components/bmghApply'
import sealingPageCheck from '../../../components/sealingPage'
import unsealingPageCheck from '../../../components/unsealingPage'
import bfAdministration from '../../../components/bfAdministration'
import bfManagement from '../../../components/bfManagement'
import swInventoryCheck from '@materialPos/swInventory'
import swReturnCheck from '@materialPos/swReturn'
import xfVehicleRepair from '../../../process/controlPos/xfVehicleRepair'
import inventoryApply from '@materialPos/inventoryApply'

export default {
  data () {
    return {
      params: '',
      currentType: 0
    }
  },
  components: {
    acceptCheck: acceptCheck,
    changeCheck: changeCheck,
    allocationCheck: allocationCheck,
    bmjyapplyCheck: bmjyapplyCheck,
    bmghapplyCheck: bmghapplyCheck,
    sealingPageCheck: sealingPageCheck,
    unsealingPageCheck: unsealingPageCheck,
    bfAdministration: bfAdministration,
    swInventoryCheck: swInventoryCheck,
    swReturnCheck: swReturnCheck,
    xfVehicleRepair: xfVehicleRepair,
    bfManagement: bfManagement,
    inventoryApply
  },
  created () {
    var _this = this
    _this.params = this.$route.query
    // 如果类型为0 进入验收草稿或历史
    _this.currentType = _this.params.processDefinitionKey || _this.params.applicationType
  },

  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.path == '/equipmentQuery') {
        vm.tableData = JSON.parse(localStorage.getItem('eqarr'))
        // vm.allotDept = JSON.parse(localStorage.getItem('allotDept'));
      } else {
        localStorage.setItem('eqarr', '')
        // localStorage.setItem('allotDept', '');
      }
    })
  }
}
</script>
<style lang="">
</style>
