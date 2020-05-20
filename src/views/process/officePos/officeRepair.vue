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
    let user = JSON.parse(localStorage.getItem('user'))
    let usrId = user.usrId.toUpperCase()
    this.url = this.sapUrl + 'sap/bc/ui5_ui5/sap/ZBCIA_IT_BGDN/index.html?sap-client=' + this.port + '&sap-ui-language=EN&sap-ui-xx-devmode=true&Uname=' + usrId
    console.log(this.url)
  }
}
</script>
<style lang="scss" scoped>
  .iframe {
    width: 100%;
    height: 100%;
    // margin: -20px;
  }
</style>
