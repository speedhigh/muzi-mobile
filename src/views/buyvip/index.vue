<template>
  <div class="relative pt-12 pb-8 bg-[#000000] min-h-screen">
    <muzi-header title="高级经理" :dark="true" />
    <div class="w-full h-full">
      <van-image :src="buyvipImg" alt="FormImg" width="100%" height="100%" @load="showForm = true" />
    </div>
    <div v-show="showForm" class="mt-2 px-4">
      <div class="w-full bg-[#373737] rounded pt-6 text-white">
        <van-form validate-trigger="onSubmit" class="space-y-4 px-8" @submit="onSubmit" @failed="onFailed">
          <!-- 真实姓名 -->
          <van-field
            v-model="form.name"
            label="姓名"
            label-width="4rem"
            placeholder="请输入真实姓名"
            required
            clearable
            :rules="rules.name"
            :border="false"
            class="border border-gray-300"
          />
          <!-- 手机号 -->
          <van-field
            v-model="form.phone"
            maxlength="11"
            type="number"
            label="手机号"
            label-width="4rem"
            placeholder="请输入手机号"
            required
            clearable
            :rules="rules.phone"
            :border="false"
            class="border border-gray-300"
          />
          <div class="text-center text-sm">
            <p>需支付<span class="text-gray-600">：</span>HK$<span class="font-bold text-xl px-0.5">598</span>/年</p>
          </div>
          <div class="space-y-2 text-center">
            <button
              native-type="submit"
              :disabled="btnDisabled"
              class="w-full h-11 rounded-full"
              :class="btnDisabled ? 'vip-btn-disabled' : 'vip-btn'"
            >
              成为木子网高级经理
            </button>
            <p class="text-xs text-gray-500">购买即视为同意
              <router-link to="/user/set/article?title=木子网高级经理用户协议&content=newbxieyi">《木子网高级经理用户协议》</router-link>
            </p>
          </div>
        </van-form>
        <p class="mt-12 text-xs p-2 text-gray-500">您在成为木子网高级经理后，半年内消费额须达到5000港币，否则高级经理会在半年后失效。</p>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import api from '/src/api/index.js'
import { useRouter } from 'vue-router'
import { Checkbox, Toast, Dialog } from 'vant'
import buyvipImg from '/src/assets/images/buyvip.webp'
import MuziHeader from '/src/components/MuziHeader.vue'
export default {
  components: {
    [Checkbox.name]: Checkbox,
    MuziHeader
  },
  setup() {
    const router = useRouter()
    const showForm = ref(false)
    const form = reactive({
      name: '',
      phone: localStorage.getItem('phone') ? localStorage.getItem('phone'):''
    })
    const rules = reactive({
      name: [{ required: true, message: '姓名不能为空'  }],
      phone: [
        {
          required: true,
          message: '电话号码不能为空',
        },
        {
          message: '电话号码格式不正确',
          validator: value => { return 11 && /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/.test(value) }
        }
      ],
    })
    const checked = ref(false)
    const btnDisabled = ref(false)
    return {
      buyvipImg,
      showForm,
      form,
      rules,
      checked,
      btnDisabled,
      onFailed(errorInfo) {
        console.log(errorInfo)
      },
      onSubmit() {
        if(!sessionStorage.getItem("token")) {
          Toast.fail('请先登录')
          router.push('/login')
          sessionStorage.setItem('loginFrom', '/buyvip')
          sessionStorage.setItem('infoFrom', '/buyvip')
          return
        }
        api.get("/myidcard/get",{ userid: sessionStorage.getItem('id') }).then((res) => {
          btnDisabled.value = true
          if(res.data.code === 20001 && res.data.msg === "没有实名") {
            sessionStorage.setItem('shiming', 0)
            sessionStorage.setItem('infoFrom', '/buyvip')
            Toast.fail('请先完善信息')
            btnDisabled.value = false
            router.replace('/info')
            return
          }
          if(res.data.code === 20000) {
            sessionStorage.setItem('shiming', 1)
            api.post('/newB/buyNewBig', form).then((res) => {
              if(res.data.msg === '您已经是高级经理啦，无须重复购买') {
                Dialog.alert({message: '您已经是高级经理啦，请重新登录以激活您的高级经理权益'}).then(() => {
                  localStorage.removeItem("buyVip")
                  sessionStorage.removeItem('token')
                  sessionStorage.removeItem("ilevel")
                  sessionStorage.setItem('loginFrom', '/paysuccess')
                  router.replace('/login')
                })
              }
              if(res.data.code === 20000) {
                localStorage.setItem('buyVip', '1')
                window.location.href = res.data.data.alipayurl
                return
              }
            })
          } else {
            sessionStorage.setItem('shiming', 0)
          }
          setTimeout(() => { btnDisabled.value = false }, 500)
        })
      }
    }
  }
}
</script>