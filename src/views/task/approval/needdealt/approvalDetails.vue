<template>
  <div class="approvalDetails">
    <!-- 外链接 -->
    <wrapUrl v-if="saphref=='true'" :parmas="params"></wrapUrl>
    <!-- formKey2 技采部 -->
    <ys-report v-else-if="formKey == 'formkey_2' && saphref=='false'" :params="params"></ys-report>
    <!--非计采部-->
    <cg-change v-else :params="params"></cg-change>

    <!-- <ys-report  :params="params"></ys-report> -->
  </div>
</template>
<script>
import { axiosPost, axiosGet } from "@/api/index.js";
import cgChange from "./components/cgChange";
import ysReport from "./components/ysReport";
import wrapUrl from "./components/wrapUrl";
import nbChange from "./components/nbChange";

export default {
  props: [], //上个页面传参
  data() {
    return {
      params: "",
      formKey: "",
      saphref: false
    };
  },
  components: {
    cgChange,
    ysReport,
    wrapUrl,
    nbChange
  },
  methods: {},
  created() {
    this.params = this.$route.query;
    console.log(this.params);
    if (!this.params.disabled) this.params.disabled = false;
    this.formKey = this.params.formKey;
    this.saphref = this.params.saphref;
  }
};
</script>
<style lang="scss" scoped>
</style>