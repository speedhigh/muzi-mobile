<template>
  <div class="relative pb-20 min-h-screen bg-white">
    <!-- banner -->
    <base-square ar="60">
      <div class="relative w-full h-full">
        <!-- top -->
        <div class="fixed top-0 inset-x-0 max-w-md w-full mx-auto h-12 flex items-center space-x-3 px-4 z-50 bg-gray-900">
          <!-- logo -->
          <van-image :src="logoImg" width="59" height="21" class="flex-shrink-0" lazy-load />
          <!-- search -->
          <router-link to="/vip/search" class="flex-grow w-full h-[1.88rem] bg-white rounded-md flex items-center space-x-2 p-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p class="text-xs text-gray-500">搜索药品、品牌</p>
          </router-link>
          <!-- chat -->
          <img :src="IconChat" alt="chatIcon" class="h-5 w-5 text-white flex-shrink-0" onclick="openZoosUrl('chatwin')">
          <component :is="'script'" language="javascript" src="http://dft.zoosnet.net/JS/LsJS.aspx?siteid=DFT78851761&float=1&lng=cn" />
        </div>
        <!-- banner -->
        <van-image :src="BannerImg" width="100%" height="100%" alt="欢迎登录木子网高级经理专属产品库" />
      </div>
    </base-square>

    <!-- main -->
    <main class="px-4 space-y-5">
      <!-- kingkong -->
      <section
        class="-mt-14 w-full py-2 px-4 rounded-md flex items-center justify-around relative bg-white" 
        style="box-shadow: 0px 0px 3px 0px #B3B3B3"
      >
        <router-link to="/vip/search/list?name=otc&drug=" class="space-y-1 text-center">
          <div class="w-12 h-12">
            <img :src="IconOtc" alt="icon_otc" class="w-full h-full">
          </div>
          <p class="text-xs">OTC药品</p>
        </router-link>
        <router-link to="/vip/search/list?name=chufang&drug=" class="space-y-1 text-center">
          <div class="w-12 h-12">
            <img :src="IconRx" alt="icon_rx" class="w-full h-full">
          </div>
          <p class="text-xs">处方药品</p>
        </router-link>
        <router-link to="/vip/search/list?name=common&drug=" class="space-y-1 text-center">
          <div class="w-12 h-12 mx-auto">
            <img :src="IconCommon" alt="icon_hot" class="w-full h-full">
          </div>
          <p class="text-xs">非专属药品</p>
        </router-link>
      </section>
      <!-- 全部药品 -->
      <section class="space-y-5">
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4">
            <img :src="IconAll" alt="icon_all" class="w-full h-full">
          </div>
          <h2>专属药品</h2>
        </div>
        <!-- card -->
        <base-pagination
          url="/open/newB/getIndexProduct"
          :params="params"
          size="10"
        >
          <template #default="slotProps">
            <div class="space-y-4">
              <div v-for="(item, index) in slotProps.list" :key="index">
                <vip-card :msg="item" />
              </div>
            </div>
          </template>
        </base-pagination>
      </section>
    </main>
    <!-- toTop -->
    <base-totop :threshold="200" />
    <!-- footer -->
    <vip-footer />
  </div>
</template>

<script>
import { ref } from 'vue'
import { Swipe, SwipeItem } from 'vant'
import api from '/src/api/index.js'
import BannerImg from '/src/assets/images/vip/banner.webp'
import logoImg from '/src/assets/images/vip/logo.png'
import IconAll from '/src/assets/images/vip/icon_all.png'
import IconChat from '/src/assets/images/vip/icon_chat.png'
import IconCommon from '/src/assets/images/vip/kingkong/common.png'
import IconOtc from '/src/assets/images/vip/kingkong/otc.png'
import IconRx from '/src/assets/images/vip/kingkong/rx.png'
import VipCard from '../components/VipCard.vue'
import VipFooter from '../components/VipFooter.vue'
export default {
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    api,
    VipCard,
    VipFooter
  },
  setup() {
    const params = ref({})
    const LR_username = localStorage.getItem('phone') ? localStorage.getItem('phone') : ''
    // api.get('/open/newB/getLunBo').then((res) => {
    //   banners.value = res.data.data
    // })
    return {
      BannerImg,
      params,
      LR_username,
      logoImg,
      IconAll,
      IconChat,
      IconCommon,
      IconOtc,
      IconRx
    }
  }
}
</script>