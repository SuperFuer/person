<!--
 * @Description: 上传文件=》上传驱动
 * @Version:
 * @Autor: louisyi
 * @Date: 2019-09-08 15:22:18
 * @LastEditors: louisyi
 * @LastEditTime: 2019-09-08 19:13:10
 -->
<template>
  <div class="uploadDrive">
    <uploadDoc pageType='DRIVE'></uploadDoc>
  </div>
</template>

<script>
import uploadDoc from './uploadDoc'
export default {
  components: {
    uploadDoc
  }
}
</script>

<style>
</style>
