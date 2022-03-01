<template>
  <div class="relative pt-12 pb-28 min-h-screen bg-white">
    <header class="fixed top-0 inset-x-0 px-4 h-12 bg-white z-50 flex items-center">
      <h1 class="text-lg font-bold">购物车</h1>
      <p class="ml-auto text-sm" @click="edit">{{ editStatus ? '完成': cartList.length > 0 ? '编辑商品' : '' }}</p>
    </header>
    <!-- loading -->
    <div v-show="showLoading" class="text-center mt-8">
      <van-loading size="30"> 加载中,请稍后... </van-loading>
    </div>
    <div v-show="!showLoading" class="mt-4 px-4">
      <div v-for="(shop, index) in cartList" :key="index">
        <div v-for="(card, idx) in shop.productMain" :key="idx">
          <!-- card -->
          <div class="flex space-x-2.5 mb-4">
            <van-checkbox
              v-model="card.check"
              :disabled="card.productMaintbl.icount === 0 && !editStatus"
              checked-color="#d2ac61"
              class="flex-shrink-0"
            />
            <van-image
              width="100"
              height="100"
              :src="card.simage1"
              radius="5"
              lazy-load
              class="flex-shrink-0"
              @click="toDetail(card.proid)"
            />
            <div class="flex-grow w-full space-y-1.5">
              <div class="space-y-1.5" @click="toDetail(card.proid)">
                <div
                  class="w-full h-5 text-sm line-1 mb-4"
                  :class="card.productMaintbl.icount === 0 ? 'text-gray-500' : ''"
                >
                  {{ card.stitle }}
                </div>
                <p :class="card.productMaintbl.icount === 0 ? 'text-red-300':'text-red-400'">
                  <span class="text-lg">{{ card.productMaintbl.iscommon ? card.productMaintbl.iprice : card.productMaintbl.svipprice }}</span>
                  <span class="ml-1 text-xs">港币</span>
                  <span 
                    class="ml-1 text-xs"
                    :class="card.productMaintbl.icount === 0 ? 'text-gray-500':'text-gray-600'"
                  >
                    约{{ card.productMaintbl.iscommon ? Math.round(card.productMaintbl.iprice * rate * 10) / 10 : Math.round(card.productMaintbl.svipprice * rate * 10) / 10}}元
                  </span>
                </p>
              </div>
              <div class="flex items-center justify-end">
                <van-stepper
                  v-model="card.icount" 
                  button-size="25"
                  max="999"
                  :disabled="card.productMaintbl.icount === 0"
                  :before-change="beforeChange"
                  @change="changeStepper(card.id, card.icount)"
                />
                <div class="ml-auto flex items-center">
                  <p class="text-xs text-gray-600">{{ card.otcorchufang }}</p>
                  <div v-if="card.productMaintbl.icount === 0" class="text-xs text-gray-500">(已售罄)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- empty -->
      <div v-if="cartList.length === 0" class="px-5 py-10 text-center">
        <img :src="emptyImg">
        <router-link to="/">
          <button class="mt-8 w-40 h-10 rounded-full vip-btn text-sm">去逛逛 >></button>
        </router-link>
      </div>
    </div>
    <!-- submitBar -->
    <van-submit-bar
      v-show="cartList.length > 0" 
      class="mb-12 border-t border-b max-w-md" 
      currency="HK$"
      button-color="linear-gradient(0deg, #F0AF5B 0%, #F9DFAF 100%)"
      :disabled="editStatus ? false : totalNum === 0 ? true : false"
      :price="editStatus ? null : totalPrice"
      :loading="submit.loading"
      :button-text="editStatus ? '删除' : '去结算('+ totalNum +')'"
      @submit="onSubmit"
    >
      <van-checkbox v-model="submit.checked" checked-color="#d2ac61" @click="checkAll(submit.checked)">全选</van-checkbox>
    </van-submit-bar>
    <base-totop :threshold="200" :position="{ bottom: '8rem', right: '1rem' }" />
    <!-- footer -->
    <vip-footer :footer-index="1" />
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { Dialog, Toast, Checkbox, Stepper } from 'vant'
import { useRouter, useRoute } from 'vue-router'
import api from '/src/api/index.js'
import emptyImg from '/src/assets/images/cart_empty.webp'
import BaseTotop from '/src/components/global/BaseTotop.vue'
import VipFooter from '../../components/VipFooter.vue'
export default {
  components: {
    [Checkbox.name]:Checkbox,
    [Stepper.name]:Stepper,
    BaseTotop,
    VipFooter
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const rate = +sessionStorage.getItem('rate')
    // mounted
    onMounted(() => {
      sessionStorage.removeItem('addressId')
      api.get('/quan/clearquanstorage', { userid: sessionStorage.getItem('id') })
    })
    const showLoading = ref(true)
    const editStatus = ref(false)
    const cartList = ref([])
    const submit = reactive({
      loading: false,
      checked: false
    })
    api.get('/newB/getMyCarts',{ userid: sessionStorage.getItem('id') }).then((res) => {
      showLoading.value = false
      if (res.data.code === 20000) cartList.value = res.data.data
    })
     // 计算总价
    const totalPrice = computed(() => {
      let t = 0
      cartList.value.forEach((item) => {
        item.productMain.forEach((i) => {
          if(i.check) {
            let price = i.productMaintbl.iscommon ? i.productMaintbl.iprice : i.productMaintbl.svipprice
            t += price * i.icount 
          }  
        })
      })
      return t * 100
    })
    // 计算总数
    const totalNum = computed(() => {
      let n = 0
      cartList.value.forEach((item) => {
        item.productMain.forEach((i) => {
          if(i.check) { n += i.icount }
        })
      })
      return n
    })
    return {
      rate,
      emptyImg,
      showLoading,
      editStatus,
      cartList,
      totalPrice,
      totalNum,
      submit,

      edit() {
        editStatus.value = !editStatus.value
        if(!editStatus.value) {
          submit.checked = false
          cartList.value.forEach(item => {
            item.checkcountry = false
            item.productMain.forEach(i => i.check = false)
          })
        }
      },

      beforeChange() {
        Toast.loading({ message: '修改中', forbidClick: true });
        return new Promise((resolve) => {
          setTimeout(() => {
            Toast.clear()
            resolve(true)
          }, 300)
        })
      },

      checkAll(checked) {
        cartList.value.forEach(item => {
          item.productMain.forEach(i => {
            if(i.productMaintbl.icount === 0 && !editStatus.value) {
              item.checkcountry = false
              i.check = false
            } else {
              item.checkcountry = checked
              i.check = checked
            }
          })
        })
      },

      changeStepper(id,count) { api.put("/newB/updateCartNum",{ cartid: id, count:count })},
      toDetail(id) { router.push('/vip/detail/'+ id) },

      onSubmit() {
        submit.loading = true
        let choiceList = []
        let selCountry = new Set()
        cartList.value.forEach((item) => {
          item.productMain.forEach((i) => {
            if(i.check) {
              choiceList.push(i.id)
              selCountry.add(item.countryname)
            }
          })
        })
        // 删除商品
        if(editStatus.value) {
          Dialog.confirm({
            title:'确认删除选中的商品吗？'
          }).then(() => {
            api.delete("/newB/deleteCartBatch",{ cartids: choiceList.toString() }).then((res) => { 
              if(res.data.code === 20000) { 
                Toast.success('删除成功')
                window.location.reload()
              } 
            })
            setTimeout(() => { submit.loading = false }, 200)
          }).catch(() => { submit.loading = false })
        } else {
          // 去结算
          // if(selCountry.size > 1) {
          //   Dialog.alert({ title: '不同国家的药品请分开结算哦' })
          //   submit.loading = false
          //   return
          // }
          if(sessionStorage.getItem('shiming') === '0') {
            Dialog.alert({ title: '您还未实名认证，请先完善信息喲~' }).then(() => {
              submit.loading = false
              sessionStorage.setItem('infoFrom', route.path)
              router.push({ path:'/info' })
            })
          } else {
            sessionStorage.setItem('orderList', choiceList)
            setTimeout(() => { submit.loading = false }, 100)
            router.push({ path:'/vip/confirmorder', query:{ from:'cart' } })
          }
        }
      }
    }
  }
}
</script>

<style>
.van-submit-bar {
  left: auto;
}
.van-submit-bar__bar {
  justify-content: space-between;
}
</style>