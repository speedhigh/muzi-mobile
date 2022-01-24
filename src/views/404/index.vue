<template>
  <div class="relative min-h-screen bg-white">
    <van-empty image="network" description="您访问的页面不存在" class="mt-36" />
    <div class="mt-3 flex items-center justify-center">
      <router-link to="/" class="w-32 py-1.5 bg-red-400 text-white text-center rounded-full">
        返回首页
      </router-link>
    </div>
  </div>
</template>

<script>
import { Empty } from 'vant'
export default {
  components: {
    [Empty.name]:Empty,
  }
}
</script>