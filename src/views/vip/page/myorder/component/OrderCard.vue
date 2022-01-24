<template>
  <div class="flex items-center text-xs">
    <p>订单号：{{ msg.id }}</p>
    <p class="text-origin-300 ml-auto">订单状态：{{ msg.orderstate }}</p>
  </div>
  <div v-for="item in msg.orderproducts" :key="item.id" class="mt-4 space-y-4">
    <div class="flex items-stretch space-x-2.5">
      <van-image
        width="100"
        height="100"
        radius="7"
        :src="item.productimage"
        lazy-load
        class="flex-shrink-0"
      >
        <template #loading>
          <van-loading type="spinner" size="20" />
        </template>
      </van-image>
      <div class="text-xs flex flex-col justify-between py-1">
        <p class="mt-1 h-8 line-2 text-xs">{{ item.productname }}</p>
        <p class="text-gray-500">x{{ item.icount }}</p>
        <p class="text-lg text-red-400">
          {{ item.iprice }} <span class="text-xs">港币</span> <span class="text-xs text-gray-500">约{{ Math.round(item.iprice * rate * 10) / 10 }}元</span>
        </p>
      </div>
    </div>
  </div>
  <!-- button -->  
  <div class="mt-4 flex items-center justify-end space-x-2.5">
    <!-- 取消订单 -->
    <button
      v-if="msg.orderstate === '待付款'" 
      class="text-gray-600 border border-gray-500 text-xs rounded-2xl" 
      style="width: 70px; height: 22px"
      :disabled="cancelDisabled"
      @click="cancelOrders(msg.id)"
    >
      取消订单
    </button>
    <!-- 查看订单 -->
    <button
      v-if="msg.orderstate !== '已评价' && msg.orderstate !== '已取消'" 
      class="text-origin-300 border border-origin-300 text-xs rounded-2xl" 
      style="width: 70px; height: 22px"
      @click="toOrderDetail(msg.id)"
    >
      查看订单
    </button>
    <!-- 确认收货 -->
    <button
      v-if="msg.orderstate === '待收货' || msg.orderstate === '正在派件'" 
      class="text-origin-300 border border-origin-300 text-xs rounded-2xl"
      style="width: 70px; height: 22px"
      @click="confirmReceipt(msg.id)"
    >
      确认收货
    </button>
    <!-- 去支付 -->
    <button 
      v-if="msg.orderstate === '待付款'" 
      class="text-origin-300 border border-origin-300 text-xs rounded-2xl" 
      style="width: 70px; height: 22px"
      :disabled="payDisabled"
      @click="toPay(msg.id)"
    >
      去支付
    </button>
  </div>
  <p class="text-right mt-4 text-xs text-gray-600">{{ count }}件商品  共{{ msg.ipaysum }}港币</p>
</template>

<script>
import { computed, ref } from 'vue'
import api from '/src/api/index.js'
import { useRouter } from 'vue-router'
import { Dialog, Toast } from 'vant'
export default {
  props: {
    msg: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const router = useRouter()
    // const route = useRoute()
    const rate = +sessionStorage.getItem('rate')
    const cancelDisabled = ref(false)
    const payDisabled = ref(false)
    const count = computed(() => {
      let c = 0
      props.msg.orderproducts.forEach(item => { c += item.icount })
      return c
    })
    return {
      rate,
      // 取消订单
      cancelDisabled,
      cancelOrders(id) {
        cancelDisabled.value = true
        Dialog.confirm({ 
          title: '确定要取消该订单吗?',
          confirmButtonText: '取消订单',
          cancelButtonText: '暂不取消'
        }).then(() => {
          api.put("/newB/cancelOrder",{ orderid: id }).then((res) => {  
            if(res.data.code === 20000) {
              Toast.success('取消成功')
              window.location.reload()
            }
          })
        }).catch(() => {cancelDisabled.value = false })
      },
      // 查看订单
      toOrderDetail(id) {
        router.push({ path: '/myorder/detail', query: { id: id } })
        return
      },
      // 确认收货
      confirmReceipt(id) {
        Dialog.confirm({
          title: '是否已收到货物?',
          confirmButtonText: '我已签收',
          cancelButtonText: '我还未签收'
        }).then(() => {
          api.put("/order/putConfirmgetpro", { userid: sessionStorage.getItem('id'), orderid: id }).then((res) => {
            if(res.data.code === 20000) {
              router.push({ path: '/myorder/detail', query: { id: id } })
            }
          })
        })
      },
      // 去支付 
      payDisabled,
      count,
      toPay(id) {
        payDisabled.value = true
        api.post("/pay/orderinfo",{ orderid: id }, true).then((res) => {
          window.location.href = res.data.data.alipayurl
          payDisabled.value = false
        })
      }
    }
  }
}
</script>