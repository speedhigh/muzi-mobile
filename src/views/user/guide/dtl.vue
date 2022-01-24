<template>
  <!-- 条款 -->
  <div class="relative pt-14 bg-white">
    <muzi-header :title="title" />
    <van-loading v-show="showLoading" size="32px" vertical class="mt-8"> 加载中，请稍后... </van-loading>
    <!-- eslint-disable vue/no-v-html -->
    <div
      v-show="!showLoading"
      class="overflow-x-hidden px-4 text-center space-y-3 flex flex-col items-center justify-center"
      v-html="content"
    />
  </div>
</template>

<script>
import { ref } from 'vue'
import api from '/src/api/index.js'
import { useRoute } from 'vue-router'
import MuziHeader from '/src/components/MuziHeader.vue'
export default {
  components: {
    MuziHeader
  },
  setup() {
    const route = useRoute()
    const showLoading = ref(true)
    const title = route.query.title
    const content = ref('')
    api.get('/open/article/get', {salias: route.query.content}).then((res) => {
      content.value = res.data.data.scontent
      showLoading.value = false
    })
    return {
      showLoading,
      title,
      content
    }
  }
}
</script>
