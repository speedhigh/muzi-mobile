<template>
  <div 
    class="relative pt-12 pb-12"
    :class="showTips ? 'h-screen overflow-hidden' : ''"
  >
    <!-- header -->
    <home-header />
    <!-- swiper -->
    <div class="absolute z-20 w-full top-[6.2rem] px-4">
      <van-swipe class="w-full h-40 rounded-md" :autoplay="5000" indicator-color="#f23030" lazy-render>
        <van-swipe-item v-for="image in data.banners" :key="image" class="w-full h-full">
          <img :src="image" width="100%" height="160" class="w-full h-full" alt="banner">
        </van-swipe-item>
      </van-swipe>
    </div>
    <!-- tab -->
    <van-tabs
      v-model:active="active"
      background="#f23030"
      color="#FFFFFF"
      line-width="50"
      title-inactive-color="#FFFFFF"
      title-active-color="#FFFFFF"
      sticky
      offset-top="48"
      @change="changeTab"
    >
      <van-tab 
        v-for="(item,index) in tabTitles" 
        :key="item.id"
        :title="item.title" 
        :name="item.id" 
        class="relative"
      >
        <!-- 半圆装饰 -->
        <div
          v-if="index === 0" 
          class="absolute top-0 w-full bg-red-400 h-[6.25rem] rounded-b-[48px]" 
        />
        <!-- main -->
        <div class="px-4 pt-44">
          <!-- kingkong -->
          <div v-if="index === 0" class="mt-2 w-full rounded-md py-2">
            <div class="grid grid-cols-5 gap-x-5 gap-y-3 text-center">
              <div v-for="area in data.kingkong" :key="area.sname">
                <div @click="clickNav(area.scode)">
                  <base-square>
                    <van-image width="100%" height="100%" :src="area.image" lazy-load :alt="area.sname" />
                  </base-square>
                  <p class="text-xs mt-1.5">{{ area.sname }}</p>
                </div>
              </div>
            </div>
          </div>
          <!-- 成为大客户 高级经理 -->
          <router-link to="/buyvip" v-if="index === 0" class="block mt-3">
            <van-image :src="BuyVipImg" width="100%" height="100%" alt="高级经理" />
          </router-link>

          <!-- 药品列表 -->
          <div class="mt-2">
            <base-pagination :url="url" :params="params" size="10">
              <template #default="slotProps">
                <div class="w-full grid grid-cols-2 gap-x-3 gap-y-3">
                  <div v-for="msg in slotProps.list" :key="msg.id">
                    <router-link :to="'/detail/'+ msg.id">
                      <muzi-card :msg="msg" />
                    </router-link>
                  </div>
                </div>
              </template>
            </base-pagination>
          </div>
        </div>
      </van-tab>
    </van-tabs>
    <!-- toTop -->
    <base-totop />
    <!-- footer -->
    <muzi-footer />

    <!-- 微信浏览器遮罩提示 -->
    <muzi-tips :show-tips="showTips" />
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import api from '/src/api/index.js'
import { useRouter, useRoute } from 'vue-router'
import { Swipe, SwipeItem, Dialog } from 'vant'
import BuyVipImg from '/src/assets/images/banner_buyvip.webp'
import HomeHeader from './component/HomeHeader.vue'
import MuziCard from '/src/components/MuziCard.vue'
import MuziTips from '/src/components/MuziTips.vue'
import MuziFooter from '/src/components/MuziFooter.vue'
export default {
  components: {
    HomeHeader,
    [Swipe.name]:Swipe,
    [SwipeItem.name]:SwipeItem,
    MuziCard,
    MuziTips,
    MuziFooter
  },
  setup() {
    // 使用不推荐的浏览器时提示
    let browsers = ['UCBrowser', 'Quark', 'micromessenger', 'MQQBrowser']
    browsers.forEach(item => {
      if(navigator.userAgent.indexOf(item) > -1) Dialog.alert({ message:'建议您使用手机自带浏览器' })
    })

    const router = useRouter()
    const route = useRoute()
    const active = ref(0)

    // banners 和 kingkong
    const data = reactive({
      banners: [],
      kingkong: []
    })
    
    api.get("/open/home/get_banner").then((res) => { 
      data.banners = res.data.data 
    })
    api.get("/open/home/get_product_class").then((res) => { 
      data.kingkong = res.data.data 
    })

    // 高级经理分享页相关
    const showTips = ref(false)
    if(route.query.ba59abbe56e057 && navigator.userAgent.toLowerCase().indexOf('micromessenger') > -1) {
      showTips.value = true
    }

    // 获取列表相关
    const url = ref('/open/home/guess_like')
    const params = ref({})
    const tabTitles = [
      { title: '首页', id: '00' },
      { title: '日本药品馆', id: '01' },
      { title: '韩国药品馆', id: '02' },
      { title: '泰国药品馆', id: '05' },
      { title: '新加坡药品馆', id: '06' },
      { title: '印度药品馆', id: '03' }
    ]
    const changeTab = name => {
      if (name === '00') {url.value = '/open/home/guess_like'; params.value = {}; return}
      if (name !== '00') {url.value = '/open/home/search'; params.value = {countryCode: name}; return}
    }
    return {
      BuyVipImg,
      active,
      data,
      showTips,
      url,
      params,
      tabTitles,
      changeTab,
      clickNav(scode) { // 点击头部跳转至搜索页面
        sessionStorage.setItem('searchFrom','/')
        router.push({ path: '/search/list', query: { id: scode }})
      }
    }
  }
}
</script>
<style>
  .van-tab--active {
    font-size: 1rem; 
    font-weight: bold;
  }
</style>