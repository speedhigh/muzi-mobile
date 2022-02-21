<template>
  <!-- 微信浏览器遮罩提示 -->
  <div v-if="showTips" class="fixed inset-0 bg-[rgba(0,0,0,0.6)] z-[100]">
    <div class="w-full text-right pr-8 pt-2">
      <van-image :src="tipsImg" width="180" height="140" alt="tips" />
    </div>
  </div>
</template>

<script>
import tipsImg from '/src/assets/images/tips.png'

export default {
  props: {
    showTips: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    return {
      tipsImg
    }
  }
}
</script>

<style>

</style>