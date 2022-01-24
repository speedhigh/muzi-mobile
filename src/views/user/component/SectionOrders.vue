<template>
  <section class="w-full h-20 bg-white rounded-xl flex items-center justify-around">
    <!-- 全部订单 -->
    <div class="w-1/5 text-center" @click="toOrder(0)">
      <van-image width="30" height="28" :src="allOrderImg" lazy-load alt="全部订单" class="relative" />
      <p class="text-xs">全部订单</p>
    </div>
    <div class="w-px h-5 bg-gray-300" />

    <!-- 待付款 -->
    <div class="w-1/5 text-center" @click="toOrder(1)">
      <van-badge :content="waitPayCount" max="99" :show-zero="false">
        <van-image width="30" height="26" :src="waitPayImg" alt="待付款" lazy-load />
      </van-badge>
      <p class="text-xs">待付款</p>
    </div>
    <div class="w-px h-5 bg-gray-300" />

    <!-- 待发货 -->
    <div class="w-1/5 text-center" @click="toOrder(2)">
      <van-badge :content="waitSendCount" max="99" :show-zero="false">
        <van-image width="30" height="30" :src="waitSendImg" alt="待发货" lazy-load />
      </van-badge>
      <p class="text-xs">待发货</p>
    </div>
    <div class="w-px h-5 bg-gray-300" />

    <!-- 待收货 -->
    <div class="w-1/5 text-center" @click="toOrder(3)">
      <van-badge :content="waitReceiptCount" max="99" :show-zero="false">
        <van-image width="30" height="27" :src="waitReceiptImg" alt="待收货" lazy-load />
      </van-badge>
      <p class="text-xs">待收货</p>
    </div>
    <div class="w-px h-5 bg-gray-300" />

    <!-- 待评价 -->
    <div class="w-1/5 text-center" @click="toOrder(5)">
      <van-badge :content="waitCommentsCount" max="99" :show-zero="false">
        <van-image width="27" height="23" :src="waitCommentsImg" alt="待评价" lazy-load />
      </van-badge>
      <p class="text-xs">待评价</p>
    </div>
  </section>
</template>

<script>
import { Badge } from 'vant'
import { useRouter } from 'vue-router'
import waitPayImg from '/src/assets/images/user/待付款.webp'
import waitSendImg from '/src/assets/images/user/待发货.webp'
import waitReceiptImg from '/src/assets/images/user/待收货.webp'
import waitCommentsImg from '/src/assets/images/user/待评价.webp'
import waitRefundCountImg from '/src/assets/images/user/售后.webp'
import allOrderImg from '/src/assets/images/user/全部订单.webp'
export default {
  components: {
    [Badge.name]: Badge
  },
  props: {
    /* eslint-disable vue/require-default-prop */
    waitPayCount: {
      type: Number,
      defalut: 0
    },
    waitSendCount: {
      type: Number,
      defalut: 0
    },
    waitReceiptCount: {
      type: Number,
      defalut: 0
    },
    waitCommentsCount: {
      type: Number,
      defalut: 0
    }
  },
  setup() {
    const router = useRouter()
    return {
      waitPayImg,
      waitSendImg,
      waitReceiptImg,
      waitCommentsImg,
      waitRefundCountImg,
      allOrderImg,
      toOrder(state) {
        router.push({ path: '/myorder', query:{ state: state } })
      }
    }
  }
}
</script>
