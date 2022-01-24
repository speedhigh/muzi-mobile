<template>
  <div class="relative pt-12 bg-white">
    <!-- header -->
    <muzi-header title="注册" />
    <!-- main -->
    <main class="p-4 space-y-1.5">
      <!-- 输入手机号，调起手机号键盘 -->
      <div class="border-b border-gray-300">
        <van-field 
          v-model="state.tel" 
          type="digit"
          maxlength="11"
          center
          clearable 
          label-width="4rem" 
          label="手机号" 
          placeholder="请输入您的手机号" 
          @update:model-value="changeTel"
        />
      </div>
      <!-- 验证码输入 -->
      <div class="border-b border-gray-300 flex items-center">
        <van-field
          v-model="state.sms"
          type="digit"
          center
          maxlength="4"
          label-width="4rem"
          label="验证码"
          placeholder="请输入短信验证码"
        />
        <sms-button :tel="state.tel" />
      </div>
      <!-- 输入密码 -->
      <div class="border-b border-gray-300">
        <van-field 
          v-model="state.pwd" 
          type="password"
          center
          clearable 
          label-width="4rem" 
          label="密码"
          maxlength="15" 
          autocomplete="off" 
          placeholder="请输入您的密码" 
        />
      </div>
      <!-- loginButton -->
      <div class="pt-12 px-12 pb-4">
        <van-button block round color="#F23030" :loading="registerLoading" @click="registered">
          注册并登陆
        </van-button>
      </div>
      <div class="mt-3 text-xs flex items-start space-x-1 px-5">
        <van-checkbox v-model="checkedProxy" icon-size="14px" checked-color="#f23030" class="flex-shrink-0" />
        <p class="-mt-0.5 leading-5 text-center">若您输入的手机号未注册，将为您直接注册，注册即视为同意
          <router-link to="/user/set/article?title=注册协议&content=zhucexieyi" class="text-red-400">木子网用户注册协议</router-link>
        </p>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import api from '/src/api/index.js'
import { checkPhone } from '/src/until/index.js'
import Encrypt from '/src/until/crypto.js'
import { Toast, Dialog, Checkbox } from 'vant'
import MuziHeader from '/src/components/MuziHeader.vue'
import SmsButton from './component/SmsButton.vue'
export default {
  components: {
    [Checkbox.name]: Checkbox,
    MuziHeader,
    SmsButton
  },
  setup() {
    const router = useRouter()
    const state = reactive({
      tel: localStorage.getItem('phone') ? localStorage.getItem('phone'):'',
      sms:'' , 
      pwd:''
    })
    const storagePhone = function(value) {
      if(value.length === 11) {
        localStorage.setItem('phone',value)
      } else {
        if (localStorage.getItem('phone')) { localStorage.removeItem('phone') }
      }
    }
    const registerLoading = ref(false)
    const checkedProxy = ref(false)
    return {
      state,
      changeTel(value) { storagePhone(value) },
      registerLoading,
      checkedProxy,
      // 注册
      registered() {
        registerLoading.value = true
        if(!state.tel || !state.sms) { Toast.fail('手机号验证码不能为空'); setTimeout( () => { registerLoading.value = false }, 500 ); return }
        if(!state.pwd) { Toast.fail('密码不能为空'); setTimeout( () => { registerLoading.value = false }, 500 ); return }
        if(!checkPhone(state.tel)) { Toast.fail('手机号格式不正确'); setTimeout( () => { registerLoading.value = false }, 500 ); return }
        if (!checkedProxy.value) { Toast.fail('请阅读并勾选协议'); setTimeout( () => { registerLoading.value = false }, 500 ); return }
        api.get("/open/register",{ 
          mobile: state.tel, 
          captcha: state.sms, 
          password: Encrypt.Encrypt(state.pwd),
          ba59abbe56e057: sessionStorage.getItem('ba59abbe56e057') ? sessionStorage.getItem('ba59abbe56e057') : '',
          proid: sessionStorage.getItem('proid') ? sessionStorage.getItem('proid') : ''
        }).then((res) => {
          if(res.data.code === 20000) {
            let postData = {}
            Object.assign(postData,{ 
              captcha: '', 
              loginType: true, 
              password: Encrypt.Encrypt(state.pwd), 
              phone: state.tel,
              shenfen: 'user',
              proid: sessionStorage.getItem('proid') ? sessionStorage.getItem('proid') : '',
              ba59abbe56e057: sessionStorage.getItem('ba59abbe56e057') ? sessionStorage.getItem('ba59abbe56e057') : ''
            })
            api.post("/open/login", postData).then((res) => {
              if(res.data.code === 20000) {
                sessionStorage.setItem('token', res.data.data.token)
                sessionStorage.setItem("id", res.data.data.user.id)
                api.get("/myidcard/get",{ userid: res.data.data.user.id }).then((res)=>{
                  if(res.data.code === 20001 && res.data.msg === "没有实名") {
                    sessionStorage.setItem('shiming', 0)
                    Toast.success('欢迎登录，请先进行实名认证！')
                    router.replace('/info')
                    return
                  }
                  res.data.code === 20000 ? sessionStorage.setItem('shiming', 1) : sessionStorage.setItem('shiming', 0)
                })
                Toast.success('登录成功')
                if(sessionStorage.getItem('loginFrom')) {
                  router.replace(sessionStorage.getItem('loginFrom'))
                } else {
                  router.push({ path: '/user'})
                }
              }
            })
          } else {
            if(res.data.msg === '用户已存在，请直接登录') {
              Dialog.confirm({
                confirmButtonText: '去登陆', 
                cancelButtonText: '忘记密码',
                title: '用户已存在，请直接登录'
              }).then(() => {
                router.push({ path: '/login' })
              }).catch(() => {
                router.push({ path: '/login/forgetpwd' })
              })
            } else {
              Toast.fail(res.data.msg)
            }
          }
          setTimeout( () => { registerLoading.value = false }, 500 )
        })
      }
    }
  }
}
</script>