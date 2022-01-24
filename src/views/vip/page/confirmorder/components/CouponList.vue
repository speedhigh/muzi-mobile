<template>
  <div>
    <div class="flex justify-between">
      <p class="text-sm">优惠券</p>
      <p 
        :class="coupon.count > 0 ? 'text-sm':'text-gray-400 text-sm'" 
        @click="clickCoupon"
      >
        {{ coupon.text }} <van-icon v-show="coupon.count > 0" name="arrow" />
      </p>
    </div>
    <van-popup
      v-model:show="coupon.show"
      round
      position="bottom"
    >
      <van-coupon-list
        :coupons="coupon.list"
        :disabled-coupons="coupon.noList"
        :chosen-coupon="coupon.chosenCoupon"
        :show-exchange-bar="false"
        @change="onChange"
      />
    </van-popup>
  </div>
</template>

<script>
import { reactive, watch } from 'vue'
import api from '/src/api/index.js'
import { Popup } from 'vant'
export default {
  components: {
    [Popup.name]: Popup
  },
  props: {
    name: {
      type: String,
      default: '暂无可用优惠券'
    }
  },
  emits:['change', 'cancel'],
  setup(props, { emit }) {
    // 优惠券
    const coupon = reactive({
      text: '暂无可用优惠券',
      show: false,
      count: 0,
      chosenCoupon: -1,
      list: [],
      noList: []
    })

    watch(() => props.name, value => { 
      if(value) coupon.text = value
    })

    // 获取数量
    api.get('/newB/getQuanVipCanUseNum', {userid: sessionStorage.getItem('id')}).then((res) => {
      coupon.count = res.data.data
      if(res.data.data > 0) coupon.text = res.data.data + '张可用'
    })


    const onChange = function(index) {
      if(index === -1) {
        api.get('/quan/clearquanstorage', { userid: sessionStorage.getItem('id') }).then((res) => {
          emit('cancel')
          coupon.text = coupon.count + '张可用'
        })
      } else {
        if (coupon.chosenCoupon !== index) {
          api.get('/quan/addquanstorage', { userid: sessionStorage.getItem('id'), quanid: coupon.list[index].id }).then((res) => {
            emit('change', coupon.list[index].value / 100, coupon.list[index].id)
            coupon.text = coupon.list[index].name
          })
        }
      }
      coupon.show = false
      coupon.chosenCoupon = index
    }
    return {
      coupon,
      onChange,
      clickCoupon() {
        if(coupon.count > 0) {
          coupon.show = true
          // 获取可用优惠券列表
          api.get('/newB/getQuanVips').then((res) => {
            coupon.list = res.data.data
            for(let i = 0; i < res.data.data.length; i++) {
              if(res.data.data[i].selected) coupon.chosenCoupon = i
            }
          })
          // 获取不可用优惠券列表
          api.get('/newB/getQuanVipsCannotUse', {userid: sessionStorage.getItem('id')}).then((res) => {
            coupon.noList = res.data.data
          })
        }
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