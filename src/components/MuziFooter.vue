<template>
  <div 
    class="fixed bottom-0 max-w-md w-full bg-white h-12 py-1.5 grid grid-cols-4 z-50 text-center"
    style="box-shadow: 0px -1px 0px 0px #E6E6E6;"
  >
    <!-- 首页 -->
    <router-link to="/">
      <div class="w-6 h-6 mx-auto">
        <img 
          :src="footerIndex === 0 ? HomeSelImg : HomeImg"
          alt="home" 
          class="w-full h-full"
        >
      </div>
      <p
        class="text-xs"
        :class="footerIndex === 0 ? 'text-red-400':'text-gray-600'"
      >
        首页
      </p>
    </router-link>
    <!-- 分类 -->
    <router-link to="/type">
      <div class="w-6 h-6 mx-auto">
        <img
          :src="footerIndex === 1 ? typeSelImg : typeImg"
          alt="type"
          class="w-full h-full"
        >
      </div>
      <p
        class="text-xs"
        :class="footerIndex === 1 ? 'text-red-400':'text-gray-600'"
      >
        分类
      </p>
    </router-link>
    <!-- 购物车 -->
    <router-link to="/cart">
      <div class="w-6 h-6 mx-auto">
        <img 
          :src="footerIndex === 2 ? cartSelImg : cartImg" 
          alt="cart" 
          class="w-full h-full"
        >
      </div>
      <p 
        class="text-xs"
        :class="footerIndex === 2 ? 'text-red-400':'text-gray-600'"
      >
        购物车
      </p>
    </router-link>
    <!-- 我的 -->
    <router-link to="/user">
      <div class="w-6 h-6 mx-auto">
        <img 
          :src="footerIndex === 3 ? userSelImg : userImg" 
          alt="user" 
          class="w-full h-full"
        >
      </div>
      <p 
        class="text-xs"
        :class="footerIndex === 3 ? 'text-red-400':'text-gray-600'"
      >
        我的
      </p>
    </router-link>
  </div>
</template>

<script>
import HomeImg from '../assets/images/footer/home.png'
import HomeSelImg from '../assets/images/footer/home_s.png'
import typeImg from '../assets/images/footer/type.png'
import typeSelImg from '../assets/images/footer/type_s.png'
import cartImg from '../assets/images/footer/cart.png'
import cartSelImg from '../assets/images/footer/cart_s.png'
import userImg from '../assets/images/footer/user.png'
import userSelImg from '../assets/images/footer/user_s.png'
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
      typeImg,
      typeSelImg,
      cartImg,
      cartSelImg,
      userImg,
      userSelImg
    }
  }
}
</script>