<style lang="scss" scoped>

</style>
<template>
  <div>
    <changeCheck :paramList="paramList"></changeCheck>
  </div>
</template>
<script>
import changeCheck from '../../components/changeCheck'
export default {
  props: ['paramList'],
  data() {
    return {
    };
  },
  components: {
    changeCheck
  },
  created() {
  },
  methods: {

  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.path == '/equipmentQuery') {
        // vm.tableData = JSON.parse(localStorage.getItem('eqarr'));
        // vm.allotDept = JSON.parse(localStorage.getItem('allotDept'));
      } else {
        // localStorage.setItem('eqarr', '');
        // localStorage.setItem('allotDept', '');
      }
    })
  }
};

</script>
