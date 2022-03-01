<template>
  <div class="relative pt-12 bg-white">
    <!-- header -->
    <muzi-header title="密码修改" />
    <!-- main -->
    <main class="p-4 space-y-1.5">
      <!-- 输入旧密码 -->
      <div class="border-b border-gray-300">
        <van-field 
          v-model="state.oldpwd" 
          type="text"
          center
          clearable 
          label-width="4rem" 
          label="旧密码"
          maxlength="15" 
          autocomplete=“off” 
          placeholder="请输入旧密码" 
        />
      </div>
      <!-- 输入新密码 -->
      <div class="border-b border-gray-300">
        <van-field 
          v-model="state.pwd" 
          type="password"
          center
          clearable 
          label-width="4rem" 
          label="新密码"
          maxlength="15" 
          autocomplete=“off” 
          placeholder="请输入新密码" 
        />
      </div>
      <!-- 再次输入新密码 -->
      <div class="border-b border-gray-300">
        <van-field 
          v-model="state.pwd2" 
          type="password"
          center
          clearable 
          label-width="4rem" 
          label="新密码"
          maxlength="15" 
          autocomplete=“off” 
          placeholder="请再次输入新密码" 
        />
      </div>
      <!-- loginButton -->
      <div class="p-12">
        <van-button block round color="#F23030" :loading="loading" @click="confirm">确认修改</van-button>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import api from '/src/api/index.js'
import { Toast } from 'vant'
import Encrypt from '/src/until/crypto.js'
import MuziHeader from '/src/components/MuziHeader.vue'
export default {
  components: {
    MuziHeader
  },
  setup() {
    const router = useRouter()
    const state = reactive({
      oldpwd: '',
      pwd: '',
      pwd2: ''
    })
    const loading = ref(false)
    return {
      state,
      loading,
      // 注册
      confirm() {
        loading.value = true
        if(!state.oldpwd || !state.pwd || !state.pwd2 ) { Toast.fail('密码不能为空'); setTimeout(() => { loading.value = false }, 300 ); return}
        if(state.pwd !== state.pwd2 ) { Toast.fail('两次密码输入不一致'); setTimeout(() => { loading.value = false }, 500); return }
        api.put("/userinfo/putpass", {
          userid: sessionStorage.getItem('id'),
          oldpass: Encrypt.Encrypt(state.oldpwd),
          newpass: Encrypt.Encrypt(state.pwd)
        }).then((res) => {
          if(res.data.code === 20000) {
            Toast.success('修改成功')
            router.replace('/user/set')
          } else {
            Toast.fail(res.data.msg)
          }
          setTimeout(() => { loading.value = false }, 300)
        })
      }
    }
  }
}
</script>