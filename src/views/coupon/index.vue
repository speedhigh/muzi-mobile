<template>
  <div class="relative min-h-screen">
    <div v-show="showLoading" class="text-center">
      <van-loading size="30" class="py-4">
        加载中，请稍后...
      </van-loading>
    </div>
    <div v-show="!showLoading" class="relative pt-12 min-h-screen">
      <muzi-header title="优惠券" />
      <van-coupon-list
        :coupons="coupon.list"
        :enabled-title=enabledTitle
        disabled-title="不可使用优惠券"
        :disabled-coupons="coupon.noList"
        :show-exchange-bar="false"
        :show-close-button="false"
      />
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import api from '/src/api/index.js'
import MuziHeader from '/src/components/MuziHeader.vue'
export default {
  components: {
    MuziHeader
  },
  setup() {
    const showLoading = ref(true)
    const enabledTitle = ref('可用优惠券')
    const coupon = reactive({
      count: 0,
      list: [],
      noList: []
    })
    api.get('/quan/getList_Canuse', {userid: sessionStorage.getItem('id')}).then((res) => {
      if(res.data.data.length === 0) { enabledTitle.value = "可使用优惠券" }
      for(let i = 0; i < res.data.data.length; i++) {
        coupon.list = res.data.data
      }
      showLoading.value = false
    })
    api.get('/quan/getList_Cannotuse', {userid: sessionStorage.getItem('id')}).then((res) => {
      for(let i = 0; i < res.data.data.length; i++) {
        coupon.noList = res.data.data
      }
    })
    return {
      showLoading,
      enabledTitle,
      coupon
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