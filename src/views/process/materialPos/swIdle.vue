<template>
  <div>
    <bmghapply :paramList="paramList"></bmghapply>
  </div>
</template>
<script>
import bmghapply from '../../components/bmghApply'
export default {
  props: ['paramList'],
  data() {
    return {

    };
  },
  components: {
    bmghapply
  },
  created() {

  },
  methods: {

  }
};

</script>
<style lang="scss" scoped>

</style>
