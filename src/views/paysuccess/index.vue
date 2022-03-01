<template>
  <div class="relative pt-12 bg-white h-screen">
    <div class="p-4">
      <div class="mt-8 flex items-center justify-center space-x-2 text-lg">
        <van-icon name="checked" color="#1678ff" size="30" />
        <p class="font-bold">订单支付完成</p>
      </div>
      <div class="mt-4 text-center text-sm space-y-2 text-gray-500 leading-5">
        <p>请重新登录以激活您的高级经理权益。如果支付失败请尝试重新支付或联系客服：<a href="tel:400-696-1987">400-696-1987</a></p>
      </div>
    </div>
    <div class="mt-10 text-center">
      <div @click="toLogin">
        <button :disabled="btnDisbled" class="w-28 h-10 bg-[#1678ff] text-white rounded-md">重新登录</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import api from '/src/api/index.js'
// import { Toast, Dialog } from 'vant'
export default {
  setup() {
    const router = useRouter()
    const btnDisbled = ref(false)
    return {
      btnDisbled,
      toLogin() {
        sessionStorage.removeItem('token')
        sessionStorage.removeItem("ilevel")
        sessionStorage.removeItem('hobby')
        localStorage.removeItem("buyVip")
        sessionStorage.setItem('loginFrom', '/paysuccess')
        router.push('/login')
        // btnDisbled.value = true
        // api.get('/open/newbgogogo').then((res) => {
        //   if(res.data.code === 20000) {
        //     Toast.success('成功')
        //     sessionStorage.removeItem('loginFrom')
        //     sessionStorage.setItem('token', res.data.data.token)
        //     sessionStorage.setItem("id", res.data.data.user.id)
        //     sessionStorage.setItem("hobby", res.data.data.user.hobby)
        //     router.replace('/vip')
        //   } else {
        //     Dialog.alert({ message: '您的登录状态已失效，请重新登录' }).then(() => {
        //       router.push('/login')
        //     })
        //   }
        //   setTimeout(() => { btnDisbled.value = false }, 500)
        // })
      },
      // back() {
      //   router.replace('/')
      // }
    }
  }
}
</script>