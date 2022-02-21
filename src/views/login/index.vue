<template>
  <div class="relative pt-12 h-screen" :class="boxStyle">
    <!-- header(user) -->
    <muzi-header title="登录" :dark="form.shenfen === 'newb'" customBack @back="back" />

    <!-- logo -->
    <div class="mt-12 text-center">
      <van-image :src="form.shenfen === 'user' ? logoImg : logoVipImg" radius="7" width="70" height="70" alt="logo" />
      <div v-if="form.shenfen === 'newb'" class="mt-4">
        <van-image :src="viptextImg" width="154" height="16" />
      </div>
    </div>

    <!-- tabbar -->
    <div class="px-11" :class="form.shenfen === 'user' ? 'mt-16' : 'mt-6'">
      <div 
        class="border-b border-gray-300 flex items-center justify-between space-x-8"
        :class="form.shenfen === 'user' ? '' : 'text-white'"
      >
        <div
          class="w-full text-center py-3"
          :class="!form.loginType ? form.shenfen === 'user' ? 'border-b-2 border-red-400' : 'border-b-2 border-origin-200' : ''"
          @click="changeTab(false)"
        >
          <p>验证码登录</p>
        </div>
        <div 
          class="w-full text-center py-3"
          :class="form.loginType ? form.shenfen === 'user' ? 'border-b-2 border-red-400' : 'border-b-2 border-origin-200' : ''"
          @click="changeTab(true)"
        >
          <p>账号密码登录</p>
        </div>
      </div>
    </div>

    <!-- form -->
    <form class="mt-8 px-11 space-y-3 text-sm">
      <!-- 手机号 -->
      <div class="w-full py-2.5 flex items-center space-x-5 border-b border-gray-300">
        <p class="w-12 flex-shrink-0" :class="form.shenfen === 'user' ? 'text-gray-600' : 'text-white'">手机号</p>
        <input
          v-model="form.phone"
          type="tel"
          maxlength="11"
          placeholder="请输入您的账号/手机号"
          :class="form.shenfen === 'user' ? '' : 'bg-gray-900 text-white'"
          @input="changePhone"
        >
      </div>
      <!-- 验证码 -->
      <div v-if="!form.loginType" class="w-full py-2.5 flex items-center space-x-5 border-b border-gray-300">
        <p class="w-12 flex-shrink-0" :class="form.shenfen === 'user' ? 'text-gray-600' : 'text-white'">验证码</p>
        <input
          v-model="form.captcha"
          type="number"
          placeholder="请输入短信验证码"
          :class="form.shenfen === 'user' ? '' : 'bg-gray-900 text-white'"
          class="w-28 flex-grow"
        >
        <sms-button :tel="form.phone" :dark="form.shenfen === 'newb'" class="ml-auto flex-shrink-0" />
      </div>
      <!-- 密码 -->
      <div v-else class="w-full py-4 flex items-center space-x-5 border-b border-gray-300">
        <p class="w-12 flex-shrink-0" :class="form.shenfen === 'user' ? 'text-gray-600' : 'text-white'">密码</p>
        <input
          v-model="form.password"
          type="password"
          placeholder="请输入密码"
          autocomplete="off"
          :class="form.shenfen === 'user' ? '' : 'bg-gray-900 text-white'"
          class="w-28"
        >
      </div>
    </form>
    <!-- 注册， 忘记密码 -->
    <div 
      class="mt-2 w-full text-sm flex items-center justify-between px-11"
      :class="form.shenfen === 'user' ? '' : 'text-white'"
    >
      <router-link to="/login/register" class="w-20 text-left py-2">注册</router-link>
      <router-link to="/login/forgetpwd" class="w-20 text-right py-2">忘记密码</router-link>
    </div>

    <!-- loginButton -->
    <div class="mt-2 px-11">
      <!-- <van-button block round :color="form.shenfen === 'user' ? '#F23030' : '#E2C796'" :disabled ="loginDisabled" @click="login">登录</van-button> -->
      <button
        class="w-full h-11 text-white rounded-full"
        :class="form.shenfen === 'user' ? 'bg-red-400' : 'vip-btn'"
        :disabled ="loginDisabled"
        @click="login"
      >
        登录
      </button>
    </div>

    <!-- 大用户 -->
    <div
      class="text-sm text-center"
      :class="form.shenfen === 'user' ? 'text-red-400' : 'text-origin-200'"
    >
      <button class="py-2.5 underline" @click="form.shenfen = form.shenfen === 'user' ? 'newb' : 'user'">
        {{ form.shenfen === 'user' ? '点击此处切换高级经理' : '点击此处切换普通用户' }}
      </button>
    </div>

    <!-- checked -->
    <div v-if="form.shenfen === 'user' && !form.loginType" class="w-full mt-8 px-8 text-center">
      <div class="flex items-start space-x-1 text-xs">
        <van-checkbox v-model="proxy.checked" icon-size="14px" checked-color="#f23030" class="flex-shrink-0"></van-checkbox>
        <p class="-mt-0.5 text-gray-500">若您输入的手机号未注册，将为您直接注册，注册即视为同意
          <router-link to="/user/set/article?title=注册协议&content=zhucexieyi" class="text-red-400">木子网用户注册协议、</router-link>
          <router-link to="/user/set/article?title=服务条款&content=advice" class="text-red-400">用户服务条款</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Toast, Checkbox, Dialog } from 'vant'
import api from '/src/api/index.js'
import { checkPhone } from '/src/until/index.js'
import Encrypt from '/src/until/crypto.js'
import logoImg from '/src/assets/images/logo.webp'
import logoVipImg from '/src/assets/images/logo_vip.webp'
import viptextImg from '/src/assets/images/viptext_img.png'
import MuziHeader from '/src/components/MuziHeader.vue'
import SmsButton from './component/SmsButton.vue'
export default {
  components: {
    MuziHeader,
    [Checkbox.name]:Checkbox,
    SmsButton
  },
  setup() {
    const router = useRouter()
    // form 表单
    const form = reactive({
      loginType: false,     // (账号密码登录（true）、验证码登录（false）)
      phone:localStorage.getItem('phone') ? localStorage.getItem('phone'):'', 
      captcha: '',
      password: '',
      shenfen: 'user',
      // proid: sessionStorage.getItem('proid') ? sessionStorage.getItem('proid') : '',
      ba59abbe56e057: sessionStorage.getItem('ba59abbe56e057') ? sessionStorage.getItem('ba59abbe56e057') : ''
    })
    let sfbl = ['/paysuccess']
    if( sfbl.includes(sessionStorage.getItem('loginFrom'))) {
      form.shenfen = 'newb'
    }

    const boxStyle = computed(() => {
      if(form.shenfen === 'user') return 'bg-white min-h-screen'
      if(form.shenfen === 'newb') return 'bg-gray-900 bg-login-bg bg-contain bg-no-repeat bg-bottom min-h-screen'
    })

    const loginDisabled = ref(false)

    const proxy = reactive({
      checked: false,
      required: false
    })

    const submit = function(postData) {
      loginDisabled.value = true
      // 发送登录请求
      api.post("/open/login", postData).then((res) => {
        if(res.data.code === 20000 && res.data.msg === '成功') {
          sessionStorage.setItem('token', res.data.data.token)
          sessionStorage.setItem("id", res.data.data.user.id)
          sessionStorage.setItem("hobby", res.data.data.user.hobby)
          // 获取实名信息
          api.get("/myidcard/get",{ userid: res.data.data.user.id }).then((res) => {
            if(res.data.code === 20001 && res.data.msg === "没有实名") {
              sessionStorage.setItem('shiming', 0)
              Toast.success('欢迎登录，请先完善信息')
              router.replace('/info')
              return
            }
            res.data.code === 20000 ? sessionStorage.setItem('shiming', 1) : sessionStorage.setItem('shiming', 0)
          })
          Toast.success('登录成功')
          window.scrollTo(0,0)   // 苹果手机底部白条
          if(res.data.data.user.hobby === 'newblogin') {
            router.replace('/vip')
          } else {
            if(sessionStorage.getItem('loginFrom')) {
              router.replace(sessionStorage.getItem('loginFrom'))
            } else {
              router.push({ path: '/user'})
            }
          }
        } else {
          if(res.data.msg === '你已经是高级经理啦，更多优惠请到高级经理界面登录') {
            Dialog.alert({
              title:'木子网温馨提示',
              message: '您已经是高级经理啦，更多优惠请切换到高级经理界面进行登录哦！',
              confirmButtonText: '切换为高级经理'
            }).then(() => {
              form.shenfen = 'newb'
            })
          } else {
            Toast.fail(res.data.msg)
          }
        }
        setTimeout( () => { loginDisabled.value = false }, 500 )
      })
    }

    return {
      logoImg,
      logoVipImg,
      viptextImg,
      boxStyle,
      form,
      loginDisabled,
      proxy,
      submit,
      back() {
        if( sessionStorage.getItem('loginFrom')) {
          if (['/cart', '/user', '/paysuccess'].includes(sessionStorage.getItem('loginFrom'))) { router.push('/'); return }
          router.go(-1)
        } else {
          router.push('/')
        }
      },
      changeTab(state) {
        state ? form.captcha = '' : form.password = ''
        form.loginType = state
      },
      changePhone() {
        if(form.phone.length === 11) {
          localStorage.setItem('phone',form.phone)
        } else {
          if (localStorage.getItem('phone')) { localStorage.removeItem('phone') }
        }
      },
      login() {
        let postData = {}
        postData = Object.assign(postData, form)
        // 验证码
        if(!form.loginType) {
          api.get('/open/isexit', { mobile: form.phone }).then((res) => {
            if(res.data.code === 20000 && form.shenfen === 'user' && !proxy.checked) {
              Toast.fail('请阅读并勾选协议'); return
            } else {
              if(!form.phone || !form.captcha) { Toast.fail('手机号验证码不能为空'); return }
              if (!checkPhone(form.phone)) { Toast.fail('手机号格式不正确'); return }
              submit(postData)
            }
          })
        }
        // 账号密码
        if(form.loginType) {
          if(!form.phone || !form.password) { Toast.fail('账号密码不能为空'); return }
          if (!checkPhone(form.phone)) { Toast.fail('手机号格式不正确'); return }
          postData.password = Encrypt.Encrypt(postData.password)
          submit(postData)
        }
      }
    }
  }
}
</script>