<style lang="scss" scoped>

</style>
<template>
  <div>
    <allocation :paramList="paramList"></allocation>
  </div>
</template>
<script>
import allocation from '../../components/allocation'
export default {
  props: ['paramList'],
  data() {
    return {

    };
  },
  components: {
    allocation
  },
  created() {
  },
  methods: {

  },
  beforeRouteEnter (to, from, next) {
    next(vm=>{
      if (from.path == '/allotEquipQuery') {
        vm.tableData = JSON.parse(localStorage.getItem('equipList'));
        vm.allotDept = JSON.parse(localStorage.getItem('allotDept'));
        vm.mutual = "add";
      } else {
        localStorage.setItem('equipList', '');
        localStorage.setItem('allotDept', '');
      }
    })
  }
};

</script>
