<template>
  <!-- 退货政策 -->
  <div class="relative pt-14 bg-white">
    <muzi-header title="用户须知" />
    <van-loading v-show="showLoading" size="32px" vertical class="mt-8"> 加载中，请稍后... </van-loading>
    <!-- eslint-disable vue/no-v-html -->
    <div
      v-show="!showLoading"
      class="overflow-x-hidden px-4 text-center space-y-3" 
      v-html="content" 
    />
  </div>
</template>

<script>
import { ref } from 'vue'
import api from '/src/api/index.js'
import MuziHeader from '/src/components/MuziHeader.vue'
export default {
  components: {
    MuziHeader
  },
  setup() {
    const showLoading = ref(true)
    const content = ref('')
    api.get('/open/article/get', {salias: '32'}).then((res) => {
      content.value = res.data.data.scontent
      showLoading.value = false
    })
    return {
      showLoading,
      content
    }
  }
}
</script>
<style>
table {
  width: 100%;
}
</style>