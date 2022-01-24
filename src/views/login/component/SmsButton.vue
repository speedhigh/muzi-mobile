<template>
  <button 
    :disabled="smsDisabled" 
    class="flex-shrink-0 w-20 h-8 text-white text-xs rounded-2xl"  
    :class="dark ? 'vip-btn' : 'bg-red-400'"
    @click="getSms"
  >
    {{ smsText }}
  </button>
</template>

<script>
import { ref } from 'vue'
import api from '/src/api/index.js'
import { Toast } from 'vant'
import { checkPhone } from '/src/until/index.js'
export default {
  props: {
    tel: {
      type: String,
      required: true
    },
    dark: {
      type: Boolean,
      default: false
    }
  },
  setup( props ) {
    const smsText = ref('发送验证码')
    const smsDisabled = ref(false)
    return {
      smsText,
      smsDisabled,
      // 获取验证码
      getSms() {
        smsDisabled.value =  true
        if(props.tel.length === 0) {
          Toast.fail('手机号不能为空')
          smsDisabled.value = false
          return 
        }
        if(!checkPhone(props.tel)) {
          Toast.fail('手机号格式不正确')
          smsDisabled.value = false
          return 
        }
        let i = 30
        smsText.value = i + 's'
        let timer = setInterval(() => {
          i -= 1
          smsText.value = i + 's'
          if(i === 0) {
            smsText.value = '发送验证码'
            smsDisabled.value = false
            clearInterval(timer)
          }
        },1000)
        api.get("/open/common/send_captcha",{phone: props.tel}).then((res)=>{
          if(res.data.code !== 20000) {
            Toast.fail('发送失败，请重新获取验证码')
            smsText.value = '发送验证码'
            smsDisabled.value = false
            return
          }
        })
      },
    }
  }
}
</script>