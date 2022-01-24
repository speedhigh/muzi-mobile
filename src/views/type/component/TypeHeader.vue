<template>
  <header class="fixed top-0 max-w-md w-full h-12 bg-white z-50 flex items-center px-4 py-2 shadow-b">
    <!-- search -->
    <div class="flex-grow h-full">
      <div class="h-full flex items-center space-x-2.5 px-3 bg-gray-200 text-gray-500 rounded-2xl" @click="search">
        <van-icon name="search" />
        <p class="text-xs">请输入您要搜索的药品、品牌</p>
      </div>
    </div>
    <p class="ml-2.5 text-sm flex-shrink-0">搜索</p>
  </header>
</template>

<script>
import { useRouter } from 'vue-router'
export default {
  setup() {
    const router = useRouter()
    return {
      search() {
        sessionStorage.setItem('searchFrom', '/type')
        router.push({ path:'/search' })
      },
    }
  }
}
</script>