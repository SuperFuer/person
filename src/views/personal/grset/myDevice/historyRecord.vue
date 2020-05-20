<template>
  <div class="history">
    <div class="form-title">
      <i class="icon"></i>
      审批历史
    </div>
    <history :childId="childId"></history>
  </div>
</template>
<script>
import history from "../../../../components/commonHistory";
export default {
  components: { history },
  data() {
    return {
      childId: ""
    };
  },
  created() {
    this.childId = this.$route.query.equipmentNum;
  }
};
</script>
<style lang="scss" scoped>
</style>
