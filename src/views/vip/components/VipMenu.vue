<template>
  <div>
    <!-- menu -->
    <div class="w-full h-11 grid grid-cols-4 text-sm shadow-b">
      <div 
        class="text-center leading-[2.75rem]"
        :class="params.type === 'time' ? 'text-origin-300' : ''"
        @click="change('time', -1)"
      >
        最新
      </div>
      <div 
        class="flex items-center justify-center space-x-1"
        :class="params.type === 'price' ? 'text-origin-300' : ''"
        @click="change('price', -1)"
      >
        <p>价格</p>
        <img v-show="params.type !== 'price'" :src="sortIcon" alt="sort" class="w-1 h-2">
        <img v-show="params.type === 'price' && params.shunxu === 1" :src="sortIconUp" alt="sort" class="w-1 h-2">
        <img v-show="params.type === 'price' && params.shunxu === -1" :src="sortIconDown" alt="sort" class="w-1 h-2">
      </div>
      <div 
        class="flex items-center justify-center space-x-1"
        :class="params.type === 'sale' ? 'text-origin-300' : ''"
        @click="change('sale', 1)"
      >
        <p>销量</p>
        <img v-show="params.type !== 'sale'" :src="sortIcon" alt="sort" class="w-1 h-2">
        <img v-show="params.type === 'sale' && params.shunxu === 1" :src="sortIconUp" alt="sort" class="w-1 h-2">
        <img v-show="params.type === 'sale' && params.shunxu === -1" :src="sortIconDown" alt="sort" class="w-1 h-2">
      </div>
      <div class="flex items-center">
        <div class="w-1 h-5" style="background: linear-gradient(-90deg, #E6E6E6 0%, rgba(245, 245, 245, 0) 100%)" />
        <div 
          class="flex-grow w-full flex items-center justify-center space-x-1"
          :class="state === 2 ? 'text-origin-300' : ''"
          @click="popup.show = true"
        >
          <p>筛选</p>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </div>
      </div>
      <van-popup 
        v-model:show="popup.show" 
        position="right"
        safe-area-inset-bottom
        round
        :style="{ width: '89%', height: '100%' }"
        @opened="tabsRef.scrollTo(0)"
      >
        <div class="w-full h-full pb-16 overflow-y-scroll relative">
          <van-tabs ref="tabsRef" v-model:active="active" color="#d2ac61" scrollspy border sticky>
            <van-tab title="选择分类" class="space-y-3 px-4 pt-px">
              <p class="mt-4 text-sm font-bold">选择分类：</p>
              <div class="grid grid-cols-3 gap-x-2.5 gap-y-4">
                <div 
                  v-for="(item, index) in popup.list" 
                  :key="index"
                  class="w-full h-[1.63rem] text-xs"
                  @click="typeSel(index, item.firstNav.code)"
                >
                  <button 
                    class="w-full h-full rounded-md border line-1"
                    :class="popup.firstIdx === index ? 'border-origin-300 text-origin-300' : 'border-gray-400 text-gray-600'"
                  >
                    {{ item.firstNav.name }}
                  </button>
                </div>
              </div>
            </van-tab>
            <van-tab title="选择症状" class="space-y-3 px-4">
              <p class="mt-4 text-sm font-bold">选择症状：</p>
              <div class="grid grid-cols-3 gap-x-2.5 gap-y-4">
                <div 
                  v-for="(item, index) in popup.list[popup.firstIdx].secondNavs" 
                  :key="index"
                  class="w-full h-[1.63rem] text-xs"
                  @click="signsSel(index, item.code)"
                >
                  <button 
                    class="w-full h-full rounded-md border"
                    :class="popup.secondIdx === index ? 'border-origin-300 text-origin-300' : 'border-gray-400 text-gray-600'"
                  >
                    {{ item.name }}
                  </button>
                </div>
              </div>
            </van-tab>
            <van-tab title="选择品牌" class="space-y-3 px-4">
              <p class="mt-4 text-sm font-bold">选择品牌：</p>
              <div class="flex items-center flex-wrap">
                <button
                  v-for="(item, index) in popup.brands" 
                  :key="index"
                  class="h-[1.63rem] text-xs rounded-md border mr-2.5 mb-4 px-2"
                  :class="popup.brandIdx === index ? 'border-origin-300 text-origin-300' : 'border-gray-400 text-gray-600'"
                  @click="brandSel(index, item.id)"
                >
                  <span class="line-1">{{ item.sname }}</span>
                </button>
              </div>
            </van-tab>
          </van-tabs>
          <!-- btn -->
          <div class="fixed bottom-0 inset-x-0 w-full h-12 z-50">
            <button 
              class="w-full h-full vip-btn text-white"
              @click="change2"
            >
              确认选择
            </button>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onActivated } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Popup } from 'vant'
import api from '/src/api/index.js'
import sortIcon from '/src/assets/images/vip/sort.webp'
import sortIconUp from '/src/assets/images/vip/sort_up.webp'
import sortIconDown from '/src/assets/images/vip/sort_down.webp'
export default {
  components: {
    [Popup.name]: Popup
  },
  emits: ['change', 'change2'],
  setup(props,{emit}) {
    const router = useRouter()
    const route = useRoute()
    const tabsRef = ref(null)
    const active = ref(0)
    // state( 1 搜索内容筛选  2 筛选内容筛选 ), 主要是提示父组件使用不同的url
    const state = ref(1)
    const params = ref({
      title: route.query.drug,
      name: route.query.name ? route.query.name : '',  // 空字符串代表搜索所有,非空需要传 otc 或者 chufang
      type: 'time',
      shunxu: -1
    })
    const popup = reactive({
      show: false,
      firstIdx: 0,
      firstnav: '',
      secondIdx: 0,
      secondnav: '',
      brandIdx: 0,
      brandid: 0,
      list: [],
      brands: []
    })
    api.get('/open/newB/getClazzBrand').then((res) => {
      popup.list = res.data.data.firstAndSecondClazzDtos
      popup.brands = res.data.data.brands
      popup.firstnav = res.data.data.firstAndSecondClazzDtos[0].firstNav.code
      popup.secondnav = res.data.data.firstAndSecondClazzDtos[0].secondNavs[0].code
      popup.brandid = res.data.data.brands[0].id
    })
    onActivated(() => {
      // state.value = 1
      // params.value.type = 'time'
      params.value.name = route.query.name ? route.query.name : ''
    })
    return {
      state,
      params,
      popup,
      tabsRef,
      active,
      sortIcon,
      sortIconUp,
      sortIconDown,
      back() { router.replace('/vip') },
      search() { router.push({ path:'/search' })},
      typeSel(index, code) {
        popup.firstIdx = index
        popup.firstnav = code
      },
      signsSel(index, code) {
        popup.secondIdx = index
        popup.secondnav = code
      },
      brandSel(index, id) {
        popup.brandIdx = index
        popup.brandid = id
      },
      change(type, shunxu) {
        if(params.value.type !== type) {
          params.value.shunxu = shunxu
          params.value.type = type
        } else {
          params.value.shunxu = -params.value.shunxu
        }
        if(state.value === 1) { emit('change', 1, params.value) }
        if(state.value === 2) { 
          emit('change2', {
            name: route.query.name ? route.query.name : '', 
            type: params.value.type,
            shunxu: params.value.shunxu,
            firstnav: popup.firstnav,
            secondnav: popup.secondnav,
            brandid: popup.brandid
          }) 
        }
      },
      change2() {
        state.value = 2
        popup.show = false
        params.value.type = 'time'
        params.value.shunxu = -1
        emit('change2', {
          name: route.query.name ? route.query.name : '', 
          type: params.value.type,
          shunxu: params.value.shunxu,
          firstnav: popup.firstnav,
          secondnav: popup.secondnav,
          brandid: popup.brandid
        }) 
      }
    }
  }
}
</script>