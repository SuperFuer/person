<template>
  <div>
    <invapply :paramList="paramList" :managementId='managementId'></invapply>
  </div>
</template>
<script>
import invapply from '../../components/invApply'
export default {
  props: ['paramList', 'managementId'],
  data() {
    return {

    };
  },
  components: {
    invapply
  },
  created() {

  },
  methods: {

  }
};

</script>
<style lang="scss" scoped>

</style>
