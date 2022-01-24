<template>
  <div class="relative bg-white min-h-screen">
    <!-- top -->
    <div class="w-full h-60 text-white relative">
      <div class="absolute inset-0 w-full h-full">
        <img :src="SalaryBanner" alt="" class="w-full h-full object-cover">
      </div>
      <div class="relative pt-12">
        <div 
          class="fixed top-0 inset-x-0 h-12 w-full z-50"
          :class="showTopBg ? 'bg-[#ff6966]' : ''"
        >
          <div class="w-full h-full flex items-center relative">
            <div class="absolute left-0 px-2" @click="back">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <p v-show="showTopBg" class="text-lg text-white mx-auto">今日收益</p>
          </div>
        </div>
        <div class="pt-1 text-center space-y-2">
          <p>今日收益 (港币)</p>
          <p class="text-3xl font-bold tracking-wider">{{ Number(msg.jinrishouyi).toFixed(2) }}</p>
        </div>
        <div class="mt-6 flex items-center">
          <div class="w-1/2 text-center flex-shrink-0 space-y-1.5">
            <p class="text-xl">{{ msg.jinrichengjiao }}</p>
            <p class="text-xs">今日成交 (笔)</p>
          </div>
          <div class="w-1/2 text-center flex-shrink-0">
            <p class="text-xl">{{ Number(msg.leijishouyi).toFixed(2) }}</p>
            <p class="text-xs">累计收益 (港币)</p>
          </div>
        </div>
      </div>
      <div v-if="!msg.iscompanyuser" class="absolute top-14 right-0">
        <van-image :src="MoneyTag" width="90" height="28" @click="withdraw" />
      </div>
    </div>
    <!-- content -->
    <div v-if="msg.salaries.length > 0" class="pt-1 px-4">
      <div v-for="(item, index) in msg.salaries" :key="index">
        <div class="py-4 border-b border-gray-300 flex items-center">
          <div class="space-y-3 flex-grow">
            <p class="text-sm line-1">{{ item.tishi }}</p>
            <p class="text-xs text-gray-600">{{ item.shijian }}</p>
          </div>
          <div class="flex-shrink-0 p-2 text-red-400 text-[1.38rem]">
            +{{ item.shouyi }}
          </div>
        </div>
      </div>
    </div>
    <van-empty v-show="msg.salaries.length === 0" description="暂无数据" class="mt-20" />
    <!-- toTop -->
    <base-totop :threshold="200" smooth />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '/src/api/index.js'
import { Empty } from 'vant'
import SalaryBanner from '/src/assets/images/vip/user/banner.webp'
import MoneyTag from '/src/assets/images/vip/user/btn_money.webp'
export default {
  components: {
    [Empty.name]: Empty
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const showTopBg = ref(false)
    const scrollHandle = function () {
      showTopBg.value = (window.scrollY > 20)
    }
    // 组件挂载时，添加scroll监听
    onMounted(() => {
      window.addEventListener("scroll", scrollHandle, false);
    })
    // 组件卸载时，停止监听
    onUnmounted(() => {
      window.removeEventListener("scroll", scrollHandle, false);
    })
    const msg = ref({
      jinrichengjiao: 0,
      jinrishouyi: 0,
      leijishouyi: 0,
      salaries: []
    })
    api.get('/newB/getSalaryDetail').then((res) => {
      msg.value = Object.assign(msg.value, res.data.data)
    })
    return {
      showTopBg,
      SalaryBanner,
      MoneyTag,
      msg,
      back() {
        router.go(-1)
      },
      withdraw() {
        router.push('/vip/salary/withdraw')
      }
    }
  }
}
</script>

<style>

</style>