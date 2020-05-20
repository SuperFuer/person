<template>
  <div>
    <!-- 报废驳回到审批人 => 做撤销-->
    <bfAdministration v-if="isXianShi == 'formkey_1'" :paramList="params"></bfAdministration>
    <!-- 报废审批-->
    <bfAdministra v-if="isXianShi != 'formkey_1'"></bfAdministra>
  </div>
</template>
<script>
import bfAdministra from '../../../components/bfAdministra'
import bfAdministration from '../../../components/bfAdministration'
export default {
  data () {
    return {
      isXianShi: '',
      params: '',
    }
  },
  components: {
    bfAdministra: bfAdministra,
    bfAdministration: bfAdministration
  },
  created () {
    this.isXianShi = this.$route.query.formKey
    this.params = this.$route.query
    console.log(this.isXianShi)
  }
}
</script>
<style lang="">
</style>
