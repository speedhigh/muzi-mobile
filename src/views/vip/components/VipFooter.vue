<template>
  <div 
    class="fixed bottom-0 max-w-md w-full bg-white h-12 py-1.5 grid grid-cols-3 z-50 text-center"
    style="box-shadow: 0px -1px 0px 0px #E6E6E6;"
  >
    <!-- 首页 -->
    <router-link to="/vip">
      <div class="w-6 h-6 mx-auto">
        <img 
          :src="footerIndex === 0 ? HomeSelImg : HomeImg"
          alt="首页" 
          class="w-full h-full"
        >
      </div>
      <p
        class="text-xs"
        :class="footerIndex === 0 ? 'text-origin-500':'text-gray-600'"
      >
        首页
      </p>
    </router-link>
    <!-- 购物车 -->
    <router-link to="/vip/cart">
      <div class="w-6 h-6 mx-auto">
        <img 
          :src="footerIndex === 1 ? cartSelImg : cartImg" 
          alt="购物车" 
          class="w-full h-full"
        >
      </div>
      <p 
        class="text-xs"
        :class="footerIndex === 1 ? 'text-origin-500':'text-gray-600'"
      >
        购物车
      </p>
    </router-link>
    <!-- 我的 -->
    <router-link to="/user">
      <div class="w-6 h-6 mx-auto">
        <img 
          :src="footerIndex === 2 ? userSelImg : userImg" 
          alt="我的" 
          class="w-full h-full"
        >
      </div>
      <p 
        class="text-xs"
        :class="footerIndex === 2 ? 'text-origin-500':'text-gray-600'"
      >
        我的
      </p>
    </router-link>
  </div>
</template>

<script>
import HomeImg from '/src/assets/images/footer/home.png'
import HomeSelImg from '/src/assets/images/footer/home_svip.png'
import cartImg from '/src/assets/images/footer/cart.png'
import cartSelImg from '/src/assets/images/footer/cart_svip.png'
import userImg from '/src/assets/images/footer/user.png'
import userSelImg from '/src/assets/images/footer/user_svip.png'
export default {
  props: {
    footerIndex: {
      type: Number,
      default: 0
    }
  },
  setup() {
    return {
      HomeImg,
      HomeSelImg,
      cartImg,
      cartSelImg,
      userImg,
      userSelImg
    }
  }
}
</script>