<template>
  <div>
    <bmjyapply :paramList="paramList"></bmjyapply>
  </div>
</template>
<script>
import bmjyapply from '../../components/bmjyApply'
export default {
  props: ['paramList'],
  data() {
    return {

    };
  },
  components: {
    bmjyapply
  },
  created() {

  },
  methods: {

  }
};

</script>
<style lang="scss" scoped>

</style>
