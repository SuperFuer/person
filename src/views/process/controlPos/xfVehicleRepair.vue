<template>
    <div class="iframe-con" id="sapGeiDe1">
			<iframe :src="url" class="iframe" scrolling="no" frameborder="no" border="0" marginWidth=100%
			 marginHeight=0></iframe>
    </div>
</template>
<script>
export default {
  props: {
    paramList: {
      type: Object
    }
  },
  data () {
    return {
      url: ''
    }
  },
  created () {
    let user = JSON.parse(localStorage.getItem('user'))
    let usrId = user.usrId.toUpperCase()  
    this.url = this.paramList.applicationSapUrl+'&Uname='+usrId;
  }
}
</script>
<style lang="scss" scoped>
  .iframe {
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
  .sapMPageEnableScrolling{  
    overflow:scroll;
    overflow-x:hidden;
    background-color:#fff;
    scrollbar-face-color:#fff;
    scrollbar-shadow-color:#fff;
    scrollbar-highlight-color:#ccc;
    scrollbar-3dlight-color:#fff;
    scrollbar-arrow-color:#f00;
    scrollbar-track-color:#fff;
}

.sapMPageEnableScrolling{
    overflow:hidden;
    height:640px;
		padding:0 45px;
		border: 0 none;
		outline: none;
}
.sapMPageEnableScrolling::-webkit-scrollbar{ //设置整个滚动条宽高
	  width:6px;
	  height:100%;
	}
	.sapMPageEnableScrolling::-webkit-scrollbar-thumb{ //设置滑块
	  width:4px;
	  height:60px;
	  background-color:#ccc;
	  border-radius:3px;
	}
	.sapMPageEnableScrolling::-webkit-scrollbar-track  
	{  
	  border-radius: 10px;  
	  background-color: rgba(255,255,255,.5);  //设置背景透明
	}
</style>