<template>
  <div class="relative pt-12 min-h-screen">
    <muzi-header title="购物指南" />
    <div class="px-4 py-2">
      <!-- 购物流程 -->
      <div class="py-5 flex items-center border-b border-gray-300 text-sm" @click="toGuideDtl('购物流程','gwlc')">
        <p>购物流程</p>
        <van-icon name="arrow" color="#999999" class="ml-auto" />
      </div>

      <!-- 支付方式 -->
      <div class="py-5 flex items-center border-b border-gray-300 text-sm" @click="toGuideDtl('支付方式','zffs')">
        <p>支付方式</p>
        <van-icon name="arrow" color="#999999" class="ml-auto" />
      </div>

      <!-- 通关税费 -->
      <div class="py-5 flex items-center border-b border-gray-300 text-sm" @click="toGuideDtl('通关税费','tgsf')">
        <p>通关税费</p>
        <van-icon name="arrow" color="#999999" class="ml-auto" />
      </div>

      <!-- 常见问题 -->
      <div class="py-5 flex items-center border-b border-gray-300 text-sm" @click="toGuideDtl('常见问题','faq')">
        <p>常见问题</p>
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
      toGuideDtl(title, content) {
        router.push({ path: '/user/guide/dtl', query: { title: title, content: content} })
      }
    }
  }
}
</script>