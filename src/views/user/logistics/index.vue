<template>
  <div class="relative pt-12 min-h-screen">
    <muzi-header title="物流配送" />
    <div class="px-4 py-2">
      <!-- 配送方式 -->
      <div class="py-5 flex items-center border-b border-gray-300 text-sm" @click="toLogisticsDtl('配送方式','shipment')">
        <p>配送方式</p>
        <van-icon name="arrow" color="#999999" class="ml-auto" />
      </div>

      <!-- 配送服务 -->
      <div class="py-5 flex items-center border-b border-gray-300 text-sm" @click="toLogisticsDtl('配送服务','shipment2')">
        <p>配送服务</p>
        <van-icon name="arrow" color="#999999" class="ml-auto" />
      </div>

      <!-- 运费标准 -->
      <div class="py-5 flex items-center border-b border-gray-300 text-sm" @click="toLogisticsDtl('运费标准','yfbz')">
        <p>运费标准</p>
        <van-icon name="arrow" color="#999999" class="ml-auto" />
      </div>

      <!-- 物流跟踪 -->
      <div class="py-5 flex items-center border-b border-gray-300 text-sm" @click="toLogisticsDtl('物流跟踪','wlgz')">
        <p>物流跟踪</p>
        <van-icon name="arrow" color="#999999" class="ml-auto" />
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import MuziHeader from '/src/components/MuziHeader.vue'
export default {
  components: {
    MuziHeader
  },
  setup() {
    const router = useRouter()
    return {
      toLogisticsDtl(title, content) {
        router.push({ path: '/user/logistics/dtl', query: { title: title, content: content} })
      }
    }
  }
}
</script>