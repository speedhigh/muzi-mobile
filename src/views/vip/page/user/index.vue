<template>
  <div class="relative pb-16 min-h-screen">
    <!-- banner -->
    <div class="w-full h-60 text-white px-4 pt-3.5 relative">
      <img :src="bgImg" alt="bg" class="absolute inset-0 w-full h-full">
      <div class="relative">
        <h1 class="text-lg font-bold">我的</h1>
        <div class="mt-9 flex items-center space-x-2">
          <van-image :src="logoImg" width="66" height="66" round class="flex-shrink-0" />
          <div>
            <p class="text-lg">{{ user.userMaintbl.iname }}</p>
            <p class="text-sm">{{ user.userMaintbl.imobile }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- main -->
    <main class="px-4 space-y-3.5">
      <!-- 我的订单 -->
      <section class="-mt-16 w-full h-28 bg-white relative pt-4 px-4 pb-5 rounded-md">
        <h2 class="font-bold">我的订单</h2>
        <div class="mt-2.5 flex items-center justify-around">
          <div class="w-full space-y-2 text-center">
            <div class="w-6 h-6 mx-auto" @click="toOrder(0)">
              <img :src="IconAll" alt="order_all" class="w-full h-full">
            </div>
            <p class="text-xs">全部订单</p>
          </div>
          <div class="w-full space-y-2 text-center">
            <div class="w-6 h-6 mx-auto" @click="toOrder(1)">
              <van-badge :content="user.daifukuancount" max="99" :show-zero="false">
                <img :src="IconWaitpay" alt="order_all" class="w-full h-full">
              </van-badge>
            </div>
            <p class="text-xs">待付款</p>
          </div>
          <div class="w-full space-y-2 text-center">
            <div class="w-6 h-6 mx-auto" @click="toOrder(2)">
              <van-badge :content="user.daifahuocount" max="99" :show-zero="false">
                <img :src="IconWaitsend" alt="order_all" class="w-full h-full">
              </van-badge>
            </div>
            <p class="text-xs">待发货</p>
          </div>
          <div class="w-full space-y-2 text-center">
            <div class="w-7 h-6 mx-auto" @click="toOrder(3)">
              <van-badge :content="user.daishouhuocount" max="99" :show-zero="false">
                <img :src="IconWaitreceipt" alt="order_all" class="w-full h-full">
              </van-badge>
            </div>
            <p class="text-xs">待收货</p>
          </div>
        </div>
      </section>
      <!-- 我的收益 -->
      <section class="w-full bg-white px-4 rounded-md">
        <div class="pt-3.5 pb-1.5">
          <div class="flex items-center">
            <h2 class="font-bold">我的收益</h2>
            <router-link to="/vip/salary" class="ml-auto underline text-xs">查看明细</router-link>
          </div>
          <p><span class="text-[1.63rem] font-bold mr-2">{{ Number(user.salary).toFixed(2) }}</span>港币</p>
        </div>
        <!-- 
          <div class="py-3 flex items-center space-x-3 text-sm text-gray-600">
            <p class="flex-shrink-0">36分钟前</p>
            <p class="flex-grow line-1">{{ user.xiuer }}</p>
          </div> 
        -->
      </section>
      <!-- 更多功能 -->
      <div class="w-full pt-4 px-4 pb-1 rounded-md bg-white">
        <h2 class="font-bold mb-1">更多功能</h2>
        <!-- 高级经理权益 -->
        <router-link to="/vip/user/rights" class="py-4 border-b border-gray-300 flex items-center">
          <p class="text-xs">权益说明</p>
          <van-icon name="arrow" class="ml-auto" />
        </router-link>
        <!-- 地址批量导入 -->
        <div class="py-4 border-b border-gray-300 flex items-center" @click="inducts">
          <p class="text-xs">地址批量导入</p>
          <van-icon name="arrow" class="ml-auto" />
        </div>
        <!-- 地址管理 -->
        <router-link to="/vip/address?switchable=true" class="py-4 border-b border-gray-300 flex items-center">
          <p class="text-xs">地址管理</p>
          <van-icon name="arrow" class="ml-auto" />
        </router-link>
        <!-- 实名认证 -->
        <div class="py-4 border-b border-gray-300 flex items-center" @click="toShiMing">
          <p class="text-xs">实名认证</p>
          <van-icon name="arrow" class="ml-auto" />
        </div>
        <!-- 密码修改 -->
        <router-link to="/login/changepwd" class="py-4 flex items-center">
          <p class="text-xs">密码修改</p>
          <van-icon name="arrow" class="ml-auto" />
        </router-link>
      </div>
      <div class="text-center py-2">
        <button class="vip-btn w-40 h-10 rounded-full text-white text-sm" @click="quit">退出登录</button>
      </div>
    </main>
    <vip-footer :footer-index="2" />
  </div>
</template>

<script>
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '/src/api/index.js'
import { Badge, Toast } from 'vant'
import logoImg from '/src/assets/images/logo.webp'
import bgImg from '/src/assets/images/vip/user/bg.webp'
import IconAll from '/src/assets/images/vip/user/icon_all.webp'
import IconWaitpay from '/src/assets/images/vip/user/icon_waitpay.webp'
import IconWaitsend from '/src/assets/images/vip/user/icon_waitsend.webp'
import IconWaitreceipt from '/src/assets/images/vip/user/icon_waitreceipt.webp'
import VipFooter from '../../components/VipFooter.vue'
export default {
  components: {
    [Badge.name]:Badge,
    VipFooter
  },
  setup() {
    window.scrollTo({ top: 0, behavior: "instant" })
    const router = useRouter()
    const route = useRoute()
    const user = reactive({
      daifahuocount: 0,
      daifukuancount: 0,
      daishouhuocount: 0,
      salary: 0,
      userMaintbl: {} 
    })
    api.get('/newB/getMyHome').then((res) => {
      Object.assign(user, res.data.data)
    })
    return {
      bgImg,
      logoImg,
      IconAll,
      IconWaitpay,
      IconWaitsend,
      IconWaitreceipt,
      user,
      toOrder(state) {
        router.push({ path: '/vip/myorder', query:{ state: state } })
      },
      inducts() {
        Toast({
          message: '功能即将上线',
          icon:'upgrade'
        })
      },
      toShiMing() {
        sessionStorage.setItem('shimingFrom', route.path) 
        router.push({ path: '/shiming' }) 
      },
      quit() {
        sessionStorage.removeItem('token')
        sessionStorage.removeItem("ilevel")
        sessionStorage.removeItem('loginFrom')
        sessionStorage.removeItem('hobby')
        Toast.success('已退出登录')
        router.replace('/')
      }
    }
  }
}
</script>