<template>
  <div>
    <div class="flex justify-between">
      <p class="text-sm">优惠券</p>
      <p 
        :class="coupon.count > 0 ? 'text-sm' : 'text-gray-400 text-sm'" 
        @click="clickCoupon"
      >
        {{ coupon.text }} <van-icon v-show="coupon.count > 0" name="arrow" />
      </p>
    </div>
    <van-popup
      v-model:show="coupon.show"
      position="bottom"
      class="w-full relative"
    >
      <div class="sticky top-0 w-full h-8 inset-0 text-center z-[10000] -mt-1 bg-gray-900 text-white text-sm leading-8" @click="closePopup">
        <span>关闭列表</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="ml-1 h-3 w-3 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
        </svg>
      </div>
      <van-tabs v-model:active="active" color="#d2ac61" sticky offset-top="32">
        <van-tab v-for="tab in tabList" :key="tab" :title="tab.title" class="p-4 bg-gray-100 w-full min-h-screen">
          <div v-if="coupon[tab.desc].length > 0" class="relative space-y-3 pb-12">
            <div 
              v-for="item in coupon[tab.desc]" :key="item.id"
              class="rounded-lg shadow-md"
              :class="active === 0 && item.selected ? 'vip-btn' : 'bg-white'"
            >
              <div class="w-full h-24 flex items-center py-3.5 px-1.5 border-b border-dashed border-gray-300">
                <div 
                  class="px-2 min-w-[87px]"
                  :class="[{'text-red-400' : active === 0 && !item.selected}, {'text-origin-500' : active === 0 && item.selected}]"
                >
                  <h2 class="text-3xl leading-8">{{ item.valueDesc }}<span class="ml-0.5 text-xs">{{ item.unitDesc }}</span></h2>
                  <p class="mt-2 text-xs">无使用门槛</p>
                </div>
                <div>
                  <p class="text-sm font-bold line-1">{{ item.name }}</p>
                  <p class="mt-2 text-xs">2021.12.29 - 2022.06.29</p>
                </div>
                <div v-if="active === 0" class="ml-auto px-3">
                  <van-checkbox 
                    v-model="item.selected" 
                    checked-color="#d2ac61"
                    @change="changeCheck(item.selected, item.id, item.valueDesc)"
                  />
                </div>
              </div>
              <div class="w-full h-9 flex items-center px-4 text-xs">
                {{ item.description }}
              </div>
            </div>
            <div class="fixed bottom-0 w-full inset-x-0 h-12 border-t border-gray-300 bg-white z-50 flex items-center text-sm py-1.5 px-2 space-x-2">
              <div class="ml-auto flex items-end">
                <p class="text-xs">已选{{ coupon.selected.length }}张，可减<span class="text-red-400">HK$</span></p>
                <p class="text-red-400 font-bold text-xl leading-6">{{ coupon.price }}</p>
              </div>
              <button class="w-1/4 h-full rounded-full vip-btn" @click="confirm">
                确定
              </button>
            </div>
          </div>
          <div v-else class="w-full h-full bg-gray-100">
            <van-empty description="暂无数据" class="mt-36" />
          </div>
        </van-tab>
      </van-tabs>
    </van-popup>
  </div>
</template>

<script>
import { ref, reactive, watch } from 'vue'
import api from '/src/api/index.js'
import { Popup, Checkbox, Empty } from 'vant'
export default {
  components: {
    [Popup.name]: Popup,
    [Checkbox.name]: Checkbox,
    [Empty.name]: Empty
  },
  props: {
    name: {
      type: String,
      default: '暂无可用优惠券'
    },
  },
  emits:['change', 'cancel'],
  setup(props, { emit }) {
    const active = ref(0)
    const tabList = ref([
      { title: '可用', desc:'list' },
      { title: '不可用', desc:'noList' },
    ])
    // 优惠券
    const coupon = reactive({
      text: '暂无可用优惠券',
      show: false,
      count: 0,
      list: [],
      noList: [],
      selected: [],
      price: 0
    })

    const checked = ref(false)

    watch(() => props.name, value => {
      if(value) coupon.text = value
    })

    // 获取数量
    api.get('/newB/getQuanVipCanUseNum', {userid: sessionStorage.getItem('id')}).then((res) => {
      coupon.count = res.data.data
      tabList.value[0].title = '可用('+ res.data.data +')'
      if(res.data.data > 0) coupon.text = res.data.data + '张可用'
    })

    // 获取可用优惠券列表
    const getQuanVips = function() {
      api.get('/newB/getQuanVips').then((res) => {
        coupon.list = res.data.data
        let sArr = []
        let p = 0
        res.data.data.forEach(item => {
          if(item.selected) {
            sArr.push(item.id)
            p += +item.valueDesc
          }
        })
        coupon.selected = sArr
        coupon.price = p
      })
    }

    // 获取不可用优惠券列表
    const getQuanVipsCannotUse = function() {
      api.get('/newB/getQuanVipsCannotUse', { userid: sessionStorage.getItem('id') }).then((res) => {
        tabList.value[1].title = '不可用('+ res.data.data.length +')'
        coupon.noList = res.data.data
      })
    }

    return {
      active,
      tabList,
      coupon,
      checked,
      changeCheck(checked, id, price) {
        if(checked) {
          coupon.selected.push(id)
          coupon.price += +price
        } else {
          coupon.selected.splice(coupon.selected.indexOf(id),1)
          coupon.price -= +price
        }
      },
      clickCoupon() {
        if(coupon.count > 0) {
          coupon.show = true
          // 获取可用优惠券列表
          getQuanVips()
          // 获取不可用优惠券列表
          getQuanVipsCannotUse()
        }
      },
      confirm() {
        coupon.show = false
        api.get('/quan/addquanstoragenewb', { userid: sessionStorage.getItem('id'), quanid: coupon.selected.toString() }).then((res) => {
          emit('change', coupon.price, coupon.selected.toString())
          if(coupon.selected.length > 0) coupon.text = '已选' + coupon.selected.length + '张，共减HK$' + coupon.price
          if(coupon.selected.length === 0) coupon.text = coupon.count + '张可用'
        })
      },
      closePopup() {
        getQuanVips()
        coupon.show = false
      }
    }
  }
}
</script>

<style>
.van-coupon-list__empty img {
  margin-left: auto;
  margin-right: auto;
}
</style>