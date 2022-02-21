<template>
  <div class="pb-16 min-h-screen relative">
    <!-- top -->
    <div class="fixed top-0 max-w-md mx-auto inset-x-0 z-50 flex items-center p-4">
      <div
        class="w-8 h-8 rounded-full flex items-center justify-center" 
        style="background-color:rgba(0,0,0,0.6)" 
        @click="back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </div>
      <div 
        class="ml-auto w-8 h-8 rounded-full flex items-center justify-center" 
        style="background-color:rgba(0,0,0,0.6)"
        @click="copy"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
        </svg>
      </div>
    </div>
    <input ref="inputCopy" :value="msg.sharelink" class="opacity-0 absolute" />
    <!-- swiper -->
    <base-square>
      <div class="w-full h-full bg-white">
        <van-swipe ref="swipeRef" class="w-full h-full bg-gray-400" :autoplay="5000" indicator-color="#f23030" lazy-render>
          <van-swipe-item v-for="(image, index) in msg.lunbos" :key="index" class="w-full h-full">
            <img :src="image" class="w-full h-full" @click="clickImg(index)">
          </van-swipe-item>
        </van-swipe>
      </div>
    </base-square>
    <van-image-preview v-model:show="preview.show" :images="msg.lunbos" :start-position="preview.index" />
    <!-- main -->
    <main class="space-y-3.5">
      <!-- section info -->
      <section class="p-4 rounded-b-2xl bg-white">
        <div class="py-0.5">
          <h1 class="font-bold line-2">{{ msg.title }}</h1>
          <p class="mt-2 text-red-400 font-semibold text-2xl">
            {{ msg.svipprice }}<span class="text-sm ml-1">港币 (约{{ Math.round(msg.svipprice * rate * 10) / 10 }}元)</span>
          </p>
          <p class="text-red-400 text-sm">预期收益{{ Math.round(+msg.yuqishouyi * rate * 10) / 10 }}元<span class="text-gray-600">（该收益仅供参考）</span></p>
          <div class="mt-3 flex justify-between text-gray-600 text-sm">
            <p>{{ msg.storename }}</p>
            <p class="flex-shrink-0 ml-2">已售{{ msg.icountsale }}件</p>
          </div>
        </div>
      </section>
      <!-- section option -->
      <section class="px-4 rounded-2xl bg-white">
        <!-- 配送地址 -->
        <div 
          class="flex items-center space-x-[1.35rem] text-sm"
          @click="popup.showAddress = true"
        >
          <p class="font-bold flex-shrink-0">配送</p>
          <div class="flex-grow py-4 border-b border-gray-300 flex items-center">
            <p class="flex-grow w-full line-1">{{ msg.addressname }}</p>
            <p class="flex-shrink-0 text-gray-500 ml-4">></p>
          </div>
        </div>
        <van-popup
          v-model:show="popup.showAddress"
          position="bottom"
          round
          closeable
          :style="{ height: '78%' }"
          @opened="popup.showAddressButton = true"
          @close="popup.showAddressButton = false"
        >
          <div class="px-5 pt-5 pb-20 relative">
            <p class="text-lg font-bold text-center">配送至</p>
            <div class="mt-5">
              <div
                v-for="(item, index) in msg.addressMaintbls"
                :key="item.id"
                class="flex items-center space-x-4"
                @click="addressSel(item.id, item.addresspre, item.detail, index)"
              >
                <div class="flex-shrink-0 w-5">
                  <van-icon v-if="popup.addressIndex === index" name="location-o" size="22" />
                </div>
                <div 
                  class="py-3 w-full flex items-center space-x-4"
                  :class="msg.addressMaintbls.length - 1 !== index ? 'border-b' : ''"
                >
                  <div class="space-y-1 flex-grow">
                    <p class="line-1">{{ item.detail }}</p>
                    <p class="text-xs text-gray-600">{{ item.addresspre }}</p>
                  </div>
                  <div class="ml-auto w-6 flex-shrink-0">
                    <van-icon v-if="popup.addressIndex === index" name="success" color="#F23030" size="20" />
                  </div>
                </div>
              </div>
            </div>
            <div v-show="popup.showAddressButton" class="fixed bottom-0 inset-x-0 w-full p-4 bg-white">
              <button class="w-full h-10 rounded-2xl bg-red-400 text-white" @click="onAdd(msg.addressMaintbls.length)">添加地址</button>
            </div>
          </div>
        </van-popup>
        <!-- 运费 -->
        <!-- <div class="flex items-center space-x-5 text-sm">
          <p class="font-bold flex-shrink-0">运费</p>
          <div class="flex-grow py-4 border-b border-gray-300">
            <p class="line-1">{{ msg.svipprice }}元</p>
          </div>
        </div> -->
        <!-- 药品参数 -->
        <div 
          class="flex items-center space-x-[1.35rem] text-sm"
          @click="popup.showParameter = true"
        >
          <p class="font-bold flex-shrink-0">参数</p>
          <div class="flex-grow py-4 flex items-center">
            <p class="flex-grow w-full">药品品牌、生产厂家、药品编号...</p>
            <p class="flex-shrink-0 text-gray-500">></p>
          </div>
        </div>
        <van-popup 
          v-model:show="popup.showParameter"
          position="bottom"
          round
          closeable
          :style="{ height: '78%' }"
        >
          <div class="px-4 py-5">
            <p class="text-lg font-bold text-center">药品参数</p>
            <div class="mt-5 text-sm">
              <!-- 品牌 -->
              <div v-if="msg.parameterDto.pinpai" class="flex space-x-5">
                <div class="w-14 font-bold flex-shrink-0 py-4">品牌</div>
                <div class="flex-grow w-full py-4 border-b border-gray-300 pr-2">{{ msg.parameterDto.pinpai }}</div>
              </div>
              <!-- 产地 -->
              <div v-if="msg.parameterDto.country" class="flex space-x-5">
                <div class="w-14 font-bold flex-shrink-0 py-4">产地</div>
                <div class="flex-grow w-full py-4 border-b border-gray-300 pr-2">{{ msg.parameterDto.country }}</div>
              </div>
              <!-- 外语名 -->
              <div v-if="msg.parameterDto.otherStitle" class="flex space-x-5">
                <div class="w-16 font-bold flex-shrink-0 py-4">外语名</div>
                <div class="flex-grow w-full py-4 border-b border-gray-300 pr-2">{{ msg.parameterDto.otherStitle }}</div>
              </div>
              <!-- 药品编号 -->
              <div v-if="msg.parameterDto.sku" class="flex space-x-5">
                <div class="w-14 font-bold flex-shrink-0 py-4">药品编号</div>
                <div class="flex-grow w-full py-4 border-b border-gray-300 pr-2">{{ msg.parameterDto.sku }}</div>
              </div>
              <!-- 重量 -->
              <div v-if="msg.parameterDto.weight" class="flex space-x-5">
                <div class="w-14 font-bold flex-shrink-0 py-4">重量</div>
                <div class="flex-grow w-full py-4 border-b border-gray-300 pr-2">{{ msg.parameterDto.weight }}kg</div>
              </div>
              <!-- 药品功能 -->
              <div v-if="msg.parameterDto.clazzname" class="flex space-x-5">
                <div class="w-14 font-bold flex-shrink-0 py-4">药品功能</div>
                <div class="flex-grow w-full py-4 pr-2">{{ msg.parameterDto.clazzname }}</div>
              </div>
              <!-- 注意事项、保存方法
              <div v-if="msg.parameterDto.zhuyishixiang" class="flex space-x-5">
                <div class="w-14 font-bold flex-shrink-0 py-4">注意事项</div>
                <div class="flex-grow w-full py-4 border-b border-gray-300 pr-2">{{ msg.parameterDto.zhuyishixiang }}</div>
              </div>
              <div v-if="msg.parameterDto.baocunfangfa" class="flex space-x-5">
                <div class="w-14 font-bold flex-shrink-0 py-4">保存方法</div>
                <div class="flex-grow w-full py-4 pr-2">{{ msg.parameterDto.baocunfangfa }}</div>
              </div>
              -->
            </div>
          </div>
        </van-popup>
      </section>
      <!-- section detail -->
      <section class="p-4 rounded-2xl bg-white">
        <!-- title -->
        <div class="flex items-center space-x-1.5">
          <div class="w-1 h-4 rounded bg-red-400" />
          <h2 class="font-bold">产品详情</h2>
        </div>
        <!-- content -->
        <div class="mt-4">
          <van-image width="100%" height="100%" :src="msg.detail" alt="产品详情" @click="toDetail(item.id)" />
        </div>
      </section>
    </main>
    <!-- dtl-footer -->
    <van-action-bar class="pl-2 pr-1 max-w-md mx-auto" style="box-shadow: 0px -1px 0px 0px #E6E6E6;">
      <!-- 购物车 -->
      <router-link to="/vip/cart?from=dtl">
        <van-action-bar-icon icon="cart-o" text="购物车" />
      </router-link>
      <!-- 客服 -->
      <van-action-bar-icon icon="chat-o" text="客服" onclick="openZoosUrl('chatwin')" />
      <component :is="'script'" language="javascript" src="http://dft.zoosnet.net/JS/LsJS.aspx?siteid=DFT78851761&float=1&lng=cn" />
      <!-- 加入购物车 -->
      <van-action-bar-button type="warning" text="加入购物车" :disabled="footer.cartDisabled" @click="addCart" />
      <!-- 立即购买 -->
      <van-action-bar-button type="danger" text="立即购买" :disabled="footer.buyDisabled" @click="buy" />
    </van-action-bar>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { ImagePreview, Swipe, SwipeItem, Popup, Toast, Dialog, ActionBar, ActionBarIcon, ActionBarButton } from 'vant'
import { useRoute, useRouter } from 'vue-router'
import api from '/src/api/index.js'
export default {
  components: {
    [Swipe.name]:Swipe,
    [SwipeItem.name]:SwipeItem,
    [Popup.name]:Popup,
    [ActionBar.name]:ActionBar,
    [ActionBarIcon.name]:ActionBarIcon,
    [ActionBarButton.name]:ActionBarButton,
    [ImagePreview.Component.name]:ImagePreview.Component
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const inputCopy = ref(null)
    onMounted(() => {
      window.scrollTo(0, 0)
      sessionStorage.removeItem('addressId')
      if (sessionStorage.getItem('token')) {
        api.get('/quan/clearquanstorage', { userid: sessionStorage.getItem('id') })
      }
    })
    const msg = ref({
      addressname: ''
    })
    const rate = +sessionStorage.getItem('rate')
    const preview = reactive({
      list: [],
      show: false,
      index: 0
    })
    const popup = reactive({
      showAddressId: 0,
      showAddress: false,
      showAddressButton: false,
      addressIndex: 0,
      showParameter: false
    })
    const footer = reactive({
      cartDisabled: false,
      buyDisabled: true
    })
    api.get('/newB/getProductDetail', { id: route.params.id }).then((res) => {
      if(res.data.code === 20001 && res.data.msg === '药品不存在') { router.replace('/404'); return }
      if(res.data.code === 20000) {
        footer.buyDisabled = res.data.data.icount === 0
        if(!res.data.data.icount) Toast.fail('库存为0')
        msg.value = res.data.data
      }
    })
    return {
      inputCopy,
      back() { router.go(-1) },
      copy() {
        inputCopy.value.select()
        document.execCommand('copy');
        Toast.success({
          message: '复制成功，快去粘贴吧！'
        })
      },
      msg,
      rate,
      preview,
      popup,
      footer,
      // 点击预览图片
      clickImg(index) {
        preview.show = true
        preview.index = index
      },
      // 选择配送地址
      addressSel(id, addresspre, detail, index) {
        popup.showAddressId = id
        popup.addressIndex = index
        popup.showAddress = false
        sessionStorage.setItem('addressId', id)
        msg.value.addressname = addresspre + ' ' + detail
      },
      // 添加地址
      onAdd(num) {
        router.push({ path: '/vip/address/edit', query: { operation: 'creat', from: route.fullPath, addressLength: num } })
      },
     // 加入购物车
      addCart() {
        footer.cartDisabled = true
        let data = { productid: route.params.id, num: '1' } 
        api.post("/newB/add2Cart", data, true).then((res) => {
          if(res.data.code === 20000) Toast.success('成功添加')
          if(res.data.code !== 20000) Toast.fail('加入购物车失败')
          setTimeout( () => { footer.cartDisabled = false }, 500 )
        })
      },
      // 购买
      buy() {
        footer.buyDisabled = true
        sessionStorage.setItem('drugId', route.params.id)
        if(sessionStorage.getItem('shiming') === '0') {
          Dialog.alert({ message: '您还未实名认证，请先完善信息喲~' }).then(() => {
            sessionStorage.setItem('infoFrom', '/vip/confirmorder?from=detail')
            footer.buyDisabled = false
            router.push({ path:'/info' }) 
          })
        } else {
          setTimeout( () => { footer.buyDisabled = false }, 300 )
          router.push({ path:'/vip/confirmorder', query: { from: 'detail' } })
        }
      }
    }
  }
}
</script>