<template>
  <div class="relative min-h-screen pb-16">
    <!-- header -->
    <user-header />
    <!-- top -->
    <div class="w-full h-48 bg-red-400 rounded-b-2xl p-4 text-white">
      <!-- avatar，id，phone，vip -->
      <div class="flex items-center mb-1.5">
        <van-image width="60" height="60" round :src="logoImg" lazy-load alt="logo">
          <template #loading>
            <van-loading type="spinner" size="20" />
          </template>
        </van-image>
        <div class="ml-2.5 space-y-0.5">
          <div class="flex items-center space-x-2.5">
            <p class="text-sm text-white">{{ user.userMaintbl.iname }}</p>
            <van-image
              v-show="user.userMaintbl.ilevel"
              width="60"
              height="16"
              radius="5"
              fit="contain"
              alt="ilevel"
              :src="user.userMaintbl.ilevel === 1 ? vipYueImg : vipZunImg" 
              lazy-load
            />
            <div 
              v-show="!user.userMaintbl.ilevel" 
              class="text-white text-xs bg-red-500 w-14 text-center rounded"
            >
              普通会员
            </div>
          </div>
          <p class="text-sm text-white">{{ user.userMaintbl.imobile }}</p>
        </div>
        <div class="ml-auto">
          <van-icon name="arrow" />
        </div>
      </div>
      <div class="py-4 flex items-center justify-around">
        <router-link to="/collection" class="w-1/4 text-center space-y-1">
          <p class="text-xl font-bold truncate">{{ user.collectcount }}</p>
          <p class="text-xs">收藏</p>
        </router-link>
        <div class="w-px h-5 bg-white" />
        <div class="w-1/4 text-center space-y-1">
          <p class="text-xl font-bold truncate">{{ user.brandcount }}</p>
          <p class="text-xs">关注品牌</p>
        </div>
        <div class="w-px h-5 bg-white" />
        <div class="w-1/4 text-center space-y-1">
          <p class="text-xl font-bold truncate">0</p>
          <p class="text-xs">足迹</p>
        </div>
        <div class="w-px h-5 bg-white" />
        <router-link to="/coupon" class="w-1/4 text-center space-y-1">
          <p class="text-xl font-bold truncate">{{ user.quancount }}</p>
          <p class="text-xs">优惠券</p>
        </router-link>
      </div>
    </div>
    <!-- main -->
    <main class="px-4 space-y-3.5">
      <!-- 积分余额 -->
      <section-asset :jifen="user.jifen" :money="user.money" />
      <!-- 订单状态 -->
      <section-orders 
        :wait-pay-count="user.daifukuancount"
        :wait-send-count="user.daifahuocount"
        :wait-receipt-count="user.daishouhuocount"
        :wait-comments-count="user.daipingjiacount"
      />
      <!-- 菜单区域 -->
      <section-menu />
    </main>
    <!-- footer -->
    <muzi-footer :footer-index="3" />
  </div>
</template>

<script>
import { reactive } from 'vue';
import api from '/src/api/index.js'
import logoImg from '/src/assets/images/logo.webp'
import vipZunImg from '/src/assets/images/user/vip_zun.webp'
import vipYueImg from '/src/assets/images/user/vip_yue.webp'
import UserHeader from './component/UserHeader.vue'
import SectionAsset from './component/SectionAsset.vue'
import SectionOrders from './component/SectionOrders.vue'
import SectionMenu from './component/SectionMenu.vue'
import MuziFooter from '/src/components/MuziFooter.vue'
export default {
  components: {
    UserHeader,
    SectionAsset,
    SectionOrders,
    SectionMenu,
    MuziFooter
  },
  setup() {
    const user = reactive({
      quancount: 0,
      brandcount: 0,
      collectcount: 0,
      daifahuocount: 0,
      daifukuancount: 0,
      daipingjiacount: 0,
      daishouhuocount: 0,
      userMaintbl: {} 
    })
    api.get('/myhome/get', { userid: sessionStorage.getItem('id') }).then((res) => {
      Object.assign(user, res.data.data)
    })
    return {
      logoImg,
      vipZunImg,
      vipYueImg,
      user
    }
  }
}
</script>