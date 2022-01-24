<template>
  <div class="relative py-12 min-h-screen">
    <muzi-header title="订单详情" />
    <van-loading v-show="showLoading" size="32px" vertical class="mt-8"> 加载中，请稍后... </van-loading>
    <!-- top -->
    <div v-show="!showLoading" class="w-full h-24 bg-gray-900 px-4 flex items-center space-x-4">
      <van-image width="45" height="45" :src="carImg" lazy-load class="flex-shrink-0">
        <template #loading>
          <van-loading type="spinner" size="20" />
        </template>
      </van-image>
      <div class="text-white space-y-1">
        <p>{{ title }}</p>
        <p class="text-xs">{{ text }}</p>
      </div>
    </div>

    <main v-show="!showLoading" class="space-y-3.5">
      <!-- address -->
      <section class="p-4 bg-white rounded-b-2xl">
        <div class="flex items-center mb-2">
          <p>{{ list.name }} {{ list.telephone }}</p>
        </div>
        <div class="max-h-9 line-2 text-[13px] text-gray-600">
          {{ list.address }} {{ list.sdetail }}
        </div>
      </section>

      <!-- card -->
      <section v-for="(item, index) in list.carts" :key="index" class="bg-white rounded-2xl p-4">
        <div class="flex items-center text-xs">
          <p>订单号：{{ id }}</p>
          <p class="text-origin-300 ml-auto"> 订单状态：{{ list.orderstate }} </p>
        </div>
        <div v-for="(msg, idx) in item.productMain" :key="idx" class="mt-4 space-y-4">
          <div class="flex items-stretch space-x-2.5">
            <van-image
              width="100"
              height="100"
              radius="7"
              :src="msg.simage1"
              lazy-load
              class="flex-shrink-0"
            >
              <template #loading>
                <van-loading type="spinner" size="20" />
              </template>
            </van-image>
            <div class="flex-grow text-xs flex flex-col justify-between py-1 relative">
              <p class="mt-1 h-8 line-2">{{ msg.stitle }}</p>
              <p class="text-gray-500">x{{ msg.icount }}</p>
              <p class="text-lg text-red-400">
                {{ msg.iprice }} <span class="text-xs">港币</span> <span class="text-xs text-gray-500">约{{ Math.round(msg.iprice * rate * 10) / 10 }}元</span>
              </p>
            </div>
          </div>
        </div>
        <!-- button -->
        <div class="mt-4 flex items-center justify-end space-x-2.5">
          <!-- 取消订单 -->
          <button
            v-if="list.orderstate === '待付款'"
            class="text-gray-600 border border-gray-500 text-xs rounded-2xl"
            style="width: 70px; height: 22px"
            :disabled="cancelDisabled"
            @click="cancelOrders()"
          >
            取消订单
          </button>
          <!-- 去支付 -->
          <button 
            v-if="list.orderstate === '待付款'"
            class="text-origin-300 border border-origin-300 text-xs rounded-2xl" 
            style="width: 70px; height: 22px"
            :disabled="payDisabled"
            @click="toPay()"
          >
            去支付
          </button>
          <!-- 查看物流 -->
          <button
            v-if="list.orderstate === '待发货' || list.orderstate === '待收货'"
            class="text-origin-300 border border-origin-400 text-xs rounded-2xl"
            style="width: 70px; height: 22px"
            :disabled="cancelDisabled"
            @click="ship(id,item.productMain[0].simage1, item.productMain.length, list.name, list.telephone, list.address, list.sdetail)"
          >
            查看物流
          </button>
        </div>   
        <p class="mt-4 text-right text-xs text-gray-600">
          {{ item.productMain.length }}件商品 共{{ list.totalprice }}港币
        </p>
      </section>

      <!-- 订单信息 -->
      <section class="p-4 bg-white rounded-2xl">
        <div class="mt-1 space-y-3 text-xs text-gray-600 text-xs">
          <div class="flex items-center justify-end">
            <p class="tracking-wider">订单编号</p>
            <p class="mx-1">：</p>
            <p class="tracking-widest w-20">{{ id }}</p>
          </div>
          <div 
            v-show="list[item.value] > 0"
            v-for="(item,index) in infoList" 
            :key="index"
            class="flex items-center justify-end"
          >
            <p class="tracking-wider">{{ item.text }}</p>
            <p class="mx-1">：</p>
            <p class="tracking-widest w-20">{{ list[item.value] }}港币</p>
          </div>
          <div class="flex items-center justify-end">
            <p class="tracking-wider">应付金额</p>
            <p class="mx-1">：</p>
            <p class="tracking-wider w-20"><span class="text-red-400 text-base font-bold mr-0.5">{{ list.totalprice }}</span>港币</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import api from '/src/api/index.js'
import { Dialog, Toast } from 'vant'
import { useRouter, useRoute } from 'vue-router'
import bgImg from '/src/assets/images/vip/user/banner.webp'
import carImg from '/src/assets/images/user/car.webp'
import MuziHeader from '/src/components/MuziHeader.vue'
export default {
  components: {
    MuziHeader
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const rate = +sessionStorage.getItem('rate')
    const showLoading = ref(true)
    const list = ref([])
    const id = route.query.id
    api.get("/newB/getOrderDetail",{ orderid: id }).then((res) => {
      if(res.data.code === 20000) {
        list.value = res.data.data
        showLoading.value = false
      }
    })
    // eslint-disable-next-line vue/return-in-computed-property
    const title = computed(() => {
      return list.value.orderstate
    })
    // eslint-disable-next-line vue/return-in-computed-property
    const text = computed(() => {
      if(list.value.orderstate === '待付款') { return '订单有效期为24小时，请尽快完成订单' }
      if(list.value.orderstate === '待发货') { return '包裹正在揽收' }
      if(list.value.orderstate === '待收货') { return '请留意电话或短信以便及时接收快递' }
    })
    const infoList = [
      { text: '商品应付总计', value:'price' },
      { text: '运费', value:'yunfei' },
      { text: '税费', value:'shuifei' },
      { text: '会员优惠', value:'vipyouhui' },
      { text: '优惠券优惠', value:'quanyouhui' }
    ]
    const cancelDisabled = ref(false)
    const payDisabled = ref(false)
    return {
      bgImg,
      rate,
      showLoading,
      id,
      carImg,
      list,
      title,
      text,
      infoList,
      cancelDisabled,
      payDisabled,
      // 取消订单
      cancelOrders() {
        cancelDisabled.value = true
        Dialog.confirm({ title: '确定要取消该订单吗?', confirmButtonText: '取消订单', cancelButtonText: '暂不取消'}).then(() => {
          api.put("/newB/cancelOrder",{ orderid: id }).then((res) => {
            if(res.data.code === 20000) {
              Toast.success('取消成功')
              router.go(-1)  
            }
          })
        }).catch(() => { cancelDisabled.value = false })
      },
      // 去支付
      toPay() {
        payDisabled.value = true
        api.post("/pay/orderinfo",{ orderid: id }, true).then((res) => {
          window.location.href = res.data.data.alipayurl
          payDisabled.value = false
        })
      },
      // 查看物流 list.name, list.telephone, list.address, list.sdetail
      ship(id, img, sum, name, tel, address, sdetail) {
        router.push({ name:'ship', params:{ id: id, img: img, sum: sum, name: name, tel: tel, address: address, sdetail: sdetail } })
      }
    }
  }
}
</script>
