<template>
  <div class="relative pt-12 pb-16 min-h-screen">
    
    <!-- header -->
    <order-header />

    <!-- 填写收货地址提示 -->
    <van-dialog 
      v-model:show="showAddDialog" 
      message="您还未设置收货地址，请填写收货地址"
      show-cancel-button 
      confirm-button-text="去填写"
      cancel-button-text="我先逛逛"
      @confirm="creatAddress"
      @cancel="cancelAddress"
    />

    <!-- main -->
    <main class="space-y-3.5">

      <!-- address -->
      <section-address @show="showAddressDialog" />

      <!-- card -->
      <section-card :list="orderList.carts" />

      <!-- price -->
      <section class="p-4 bg-white rounded-2xl space-y-3.5">
        <!-- 商品金额 -->
        <div class="flex justify-between text-sm">
          <p>商品金额</p>
          <p>{{ price }}港币</p>
        </div>
        <!-- 运费 -->
        <div v-show="freight !== 0" class="flex justify-between text-sm">
          <p>运费</p>
          <p>{{ freight }}港币</p>
        </div>
        <!-- 税费 -->
        <div class="flex justify-between text-sm">
          <p>税费</p>
          <p>{{ tax }}港币</p>
        </div>
        <!-- 优惠券列表 -->
        <coupon-list :name="coupon.text" @change="changeCoupon" @cancel="cancelCoupon" />
        <!-- 会员优惠 -->
        <!-- <div v-show="vipOffers !== 0" class="flex justify-between text-sm">
          <p>会员优惠</p>
          <p>-{{ vipOffers }}港币</p>
        </div> -->
        <!-- 运费提示 -->
        <div class="text-right text-xs text-gray-600">邮费65港币，满500邮费20，满700包邮</div>
        <!-- 同意委托 -->
        <div class="flex justify-end items-center text-xs">
          <van-checkbox v-model="checkedProxy" icon-size="14px" checked-color="#f23030">
            <p class="tracking-tighter">本人同意并接受</p>
          </van-checkbox>
          <p class="text-red-400" @click="showProxy">《进口个人申报委托》</p>
        </div>
      </section>
      <!-- 支付方式 -->
      <section class="p-4 bg-white rounded-2xl flex items-center justify-between">
        <p class="text-sm">支付方式</p>
        <van-image
          width="90"
          height="35"
          src="http://www.muzimed.com/images/base/zhifu-alipay.png"
          fit="cover"
          round
          lazy-load
        />
      </section>
    </main>

    <!-- 提交订单 -->
    <van-submit-bar
      v-if="showSubmit"
      class="border-t max-w-md mx-auto"
      currency="HK$"
      :price="totalPrice"
      :disabled="submitDisbled"
      button-text="去结算"
      @submit="onSubmit"
    />
  </div>
</template>

<script>
import { computed, ref, reactive } from 'vue'
import api from '/src/api/index.js'
import { Dialog, Checkbox } from 'vant'
import { useRouter, useRoute } from 'vue-router'
import OrderHeader from './component/OrderHeader.vue'
import SectionAddress from './component/SectionAddress.vue'
import SectionCard from './component/SectionCard.vue'
import CouponList from "./component/CouponList.vue"
export default {
  components: {
    [Checkbox.name]:Checkbox,
    OrderHeader,
    SectionAddress,
    SectionCard,
    CouponList
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const showAddDialog = ref(false)
    const hasAddress = ref(true)
    const submitDisbled = ref(true)
    const showSubmit = ref(false)
    // 优惠券
    const coupon = reactive({
      value: 0,
      text: '',
      id: null
    })
    const changeCoupon = (price, id) => {
      coupon.value = price
      coupon.id = id
    }
    const cancelCoupon = () => {
      coupon.value = 0 
      coupon.id = null  
    }
    
    // 订单详情
    const orderList = ref({carts:[]})
    let getList = function(url, data) {
      api.get(url, data).then((res) => {
        if(res.data.code === 20000) {
          orderList.value = Object.assign(orderList.value, res.data.data)
          if(res.data.data.usingquan.id) {
            coupon.value = res.data.data.usingquan.quanvalue
            coupon.text = res.data.data.usingquan.quanname
            coupon.id = res.data.data.usingquan.id
          }
          submitDisbled.value = false
          showSubmit.value = true
        }
      })
    }
    if (route.query.from === 'cart') {
      getList('/pay/confirmorder', { userid: sessionStorage.getItem('id'), cartids: sessionStorage.getItem('orderList') })
    } else {
      getList('/pay/buynow', { userid: sessionStorage.getItem('id'), pid: sessionStorage.getItem('drugId') })
    }

    // 价格
    const price = computed(() => {
      let p = 0
      orderList.value.carts.forEach((item) => {
        item.productMain.forEach((i) => {
          p += i.productMaintbl.iprice * i.icount
        })
      })
      return p
    })

    // 运费
    const freight = computed(() => {
      if (orderList.value.vip === 2) return 0
      if(price.value < 500) return 65
      if(price.value > 700) return 0
      return 20
    })

    // 税费
    const tax = computed(() => { 
      return Math.ceil(price.value * 0.5) / 10 
    })

    // 会员优惠
    // const vipOffers = computed(() => {
    //   if (orderList.value.vip) {
    //     return ( price.value * ( orderList.value.vip / 10 ) ).toFixed(1)
    //   } else { return 0 }
    // })

    // 总价
    const totalPrice = computed(() => {
      let total = (price.value + freight.value + tax.value - coupon.value) * 100
      if(total > 0) {
        if(orderList.value.carts.length > 0) submitDisbled.value = false
        return total 
      } else {
        submitDisbled.value = true
        return 0
      }
    })

    // 勾选委托书
    const checkedProxy = ref(true)

    return {
      showAddDialog,
      hasAddress,
      showAddressDialog() { showAddDialog.value = true; hasAddress.value = false },
      creatAddress() {
        router.push({ path: '/address/edit', query: { operation: 'creat', from: route.fullPath} }) 
      },
      cancelAddress() {
        showAddDialog.value = false 
      },
      submitDisbled,
      showSubmit,
      orderList,
      coupon,
      changeCoupon,
      cancelCoupon,
      price,
      freight,
      tax,
      // vipOffers,
      totalPrice,
      checkedProxy,
      showProxy() {
        Dialog({ confirmButtonText: '关闭', title: '进口个人申报委托', message: '本人承诺所购买商品系个人合理自用，不会进行二次销售，针对境外（包括保税区等特殊监管区域）发货的各种商品，现委托商家或其委托的物流商代理申报、代缴税款等通关事宜，本人保证遵守《海关法》和国家相关法律法规，保证所提供的收件人身份信息和收货信息真实完整，无侵犯他人权益的行为，并督促保证代缴义务人足额支付应缴税款。以上委托关系系如实填写，本人愿意接受海关及其他监管部门的监管，并承担相应法律责任。' })
      },
      onSubmit() {
        if(!hasAddress.value) { showAddDialog.value = true; return }
        if (!checkedProxy.value) {
          submitDisbled.value = false
          Dialog({ title: '请选择同意进口个人申报委托' })
          return
        }
        submitDisbled.value = true
        let data = {
          userid: sessionStorage.getItem('id'),
          addressinfo: sessionStorage.getItem('addressId'),
          quaninfo:  coupon.id,
          jifenused: 0,
          tprice: totalPrice.value/100
        }
        if(route.query.from === 'detail') {
          data.amount = orderList.value.carts[0].productMain[0].icount
          data.cartinfo = orderList.value.cartinfo
        } else {
          data.cartinfo = orderList.value.cartinfo + ','
        }
        api.post("/pay/submitorder", data, true).then((res) => {
          if(res.data.code === 20000) {
            api.post("/pay/orderinfo",{ orderid: res.data.data.orderid }, true).then((res) => {
              window.location.href = res.data.data.alipayurl
            })
          }
        })
      },
    }
  }
}
</script>