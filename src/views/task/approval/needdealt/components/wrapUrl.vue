<template>
    <div class="iframe-wrap" id="sapGeiDe1">
			<iframe :src="url" class="iframe" scrolling="no" frameborder="no" border="0" marginWidth=0
			 marginHeight=0 width="100%" height="100%"></iframe>
    </div>
</template>
<script>
export default {
  props:{
    parmas:{
      type:Object
    }
  },
  data () {
    return {
      url: ''
    }
  },
  created () {
    console.log(this.parmas)
    var currentUrl= localStorage.getItem("sapurl");
    var c=currentUrl.indexOf('http');
    var m=currentUrl.indexOf("&disabled");
    console.log(c+"==="+m)
    console.log(currentUrl)
    currentUrl= currentUrl.substring(c,m);
    this.url=currentUrl;
   console.log(currentUrl);
  }
}
</script>
<style lang="scss" scoped>
  .iframe-wrap {
    width: 100%;
    height: 100%;
  }
  #sapGeiDe1 {
    width: 105.6%;
    height: 92%!important;
    position: absolute;
    top: -20px;
    left: -20px;
    right: -20px;
    bottom: 0; 
  }
</style>
