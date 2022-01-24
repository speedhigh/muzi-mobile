<template>
  <section v-if="showAddress" class="py-4 pl-4 pr-11 bg-white rounded-b-2xl relative"> 
    <van-loading v-if="showLoading" size="20px" class="text-xs text-center"> 加载中，请稍后... </van-loading>
    <div v-else @click="toAddress">
      <div class="flex items-center mb-2">
        <p>{{ addressMsg.slinkman }} {{ addressMsg.smobile }}</p>
        <button
          v-show="addressMsg.itype === 2"
          class="ml-2 block bg-red-400 rounded-full text-xs px-1 text-white -mt-0.5"
        >
          默认
        </button>
      </div>
      <div class="max-h-9 text-[13px] text-gray-600 line-2">
        {{ addressMsg.saddressname }} {{ addressMsg.sdetail }}
      </div>
      <div class="absolute text-xl" style="top:50%; right:16px; transform: translate(0, -50%);">
        <van-icon name="arrow" color="#969799" />
      </div>
    </div>
  </section>
</template>

<script>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '/src/api/index.js'
export default {
  emits:['show'],
  setup(props, { emit }) {
    const router = useRouter()
    const route = useRoute()
    const showLoading = ref(true)
    const showAddress = ref(true)
    const addressMsg = ref({})
    const getData = function(url, data) {
      api.get(url, data ).then((res) => {
        if(res.data.code === 20000) {
          showLoading.value = false
          Object.assign(addressMsg.value, res.data.data)
          sessionStorage.setItem('addressId',res.data.data.id)
        }
        if(res.data.code === 20001) {
          showLoading.value = showAddress.value = false
          emit('show')
        }
      })
    }
    if (sessionStorage.getItem('addressId')) {
      getData('/useraddress/get', { addressid:sessionStorage.getItem('addressId')})
    } else {
      getData('/useraddress/getdefault', { userid: sessionStorage.getItem('id') })
    }
    return {
      showAddress,
      showLoading,
      addressMsg,
      toAddress() { router.push({ path:'/vip/address', query:{ from: route.query.from } }) }
    }
  }
}
</script>
