<template>
    <div class="iframe-con sapGeiDe">
      <iframe :src="url" class="iframe" scrolling="no" frameborder="no" border="0" marginWidth=0
			 marginHeight=0></iframe>
    </div>
</template>
<script>
export default {
    data () {
    return {
      url: ''
    }
  },
  created () {
    this.url = 'http://10.40.19.41:7005/arcgis/index.html'
    console.log(this.url, 'hhhhh')
  }
}
</script>
<style lang="scss" scoped>
      .iframe {
        width: 100%;
        height: 100%;
        margin: -20px;
      }
</style>