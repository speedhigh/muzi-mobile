<template>
  <div class="flex space-x-2.5">
    <van-image 
      :src="msg.thumbnail" 
      width="90" 
      height="90" 
      radius="5"
      class="flex-shrink-0"
      @click="toDtl(msg.id)"
      lazy-load
    />
    <div class="flex-grow w-full space-y-0.5">
      <div @click="toDtl(msg.id)">
        <div v-html="msg.name" class="w-full h-5 text-sm line-1" />
        <p class="mt-3">
          <span class="text-lg text-red-400">{{ msg.hkdprice }}</span>
          <span class="ml-1 text-xs text-red-400">港币</span>
          <span class="ml-1 text-xs text-gray-600">约{{ Math.round(msg.hkdprice * rate * 10) / 10 }}元</span>
        </p>
      </div>
      <div class="flex items-end relative">
        <van-stepper
          v-model="icount" 
          button-size="25"
          max="999"
          :before-change="beforeChange"
        />
        <button 
          v-if="showCartBtn" 
          :disabled="cartDisabled" 
          class="vip-btn text-xs w-[84px] h-[26px] rounded ml-auto" 
          @click="addCart(msg.id)"
        >
          加入购物车
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import api from '/src/api/index.js'
import { useRouter, useRoute } from 'vue-router'
import { Stepper, Toast } from 'vant'
export default {
  components: {
    [Stepper.name]: Stepper
  },
  props: {
    msg: {
      type: Object,
      required: true
    },
    isLink: {
      type: Boolean,
      default: true
    },
    showCartBtn: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const icount = ref(1)
    const router = useRouter()
    const route = useRoute()
    const cartDisabled = ref(false)
    const rate = +sessionStorage.getItem('rate')
    return {
      icount,
      rate,
      cartDisabled,
      toDtl(id) {
        if(props.isLink) router.push({ path: '/vip/detail/'+ id }) 
      },
      beforeChange() {
        Toast.loading({ message: '修改中', forbidClick: true });
        return new Promise((resolve) => {
          setTimeout(() => {
            Toast.clear();
            resolve(true);
          }, 300);
        });
      },
      // 加入购物车
      addCart(id) {
        cartDisabled.value = true
        api.post("/newB/add2Cart", { productid: id, num: icount.value }, true).then((res) => {
          if(res.data.code === 20000) {
            Toast.success('成功添加')
            icount.value = 1
          }
          if(res.data.code !== 20000) Toast.fail('加入购物车失败')
          setTimeout( () => { cartDisabled.value = false }, 500 )
        })
      }
    }
  }
}
</script>