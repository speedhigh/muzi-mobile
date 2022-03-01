<template>
  <div class="relative pt-12 bg-white">
    <!-- header -->
    <muzi-header title="实名认证" />
    <!-- content -->
    <div class="w-full space-y-1.5 p-4">
      <!-- 输入姓名 -->
      <div class="border-b border-gray-300">
        <van-field 
          v-model="state.name" 
          maxlength="8"
          center
          clearable 
          label-width="4rem" 
          label="真实姓名" 
          placeholder="请输入您的真实姓名" 
        />
      </div>

      <!-- 输入身份证号 -->
      <div class="border-b border-gray-300">
        <van-field 
          v-model="state.id" 
          maxlength="18"
          center
          clearable 
          label-width="4rem" 
          label="身份证号" 
          readonly
          :right-icon="state.id ? 'clear' : ''"
          placeholder="请输入您的身份证号"
          @focus="getIdFocus"
          @click-right-icon="state.id = ''"
        />
        <van-number-keyboard
          v-model="state.id" 
          :show="showIdKeyboard"
          extra-key="X"
          close-button-text="完成"
          @blur="showIdKeyboard = false"
        />
      </div>

      <!-- 输入手机号 -->
      <div class="border-b border-gray-300">
        <van-field 
          v-model="state.tel" 
          type="digit"
          maxlength="11"
          center
          clearable 
          label-width="4rem" 
          label="手机号码" 
          placeholder="请输入您的手机号" 
        />
      </div>
    </div>
    <!-- loginButton -->
    <div class="p-12">
      <van-button block round color="#F23030" :loading="loading" @click="save">
        保存
      </van-button>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import api from '/src/api/index.js'
import { useRouter } from 'vue-router'
import { checkId, checkPhone } from '/src/until/index.js'
import { Toast, NumberKeyboard } from 'vant'
import MuziHeader from '/src/components/MuziHeader.vue'
export default {
  components: {
    [NumberKeyboard.name]:NumberKeyboard,
    MuziHeader
  },
  setup() {
    const router = useRouter()
    const state = reactive({ 
      name: '',
      id: '',
      tel:localStorage.getItem('phone') ? localStorage.getItem('phone'):''
    })
    const loading = ref(false)
    const showIdKeyboard = ref(false)
    api.get("/myidcard/get",{ userid: sessionStorage.getItem('id') }).then((res) => { 
      if(res.data.code === 20000) {
        state.name = res.data.data.srealname
        state.id = res.data.data.scardno
      }
    })
    return {
      state,
      loading,
      showIdKeyboard,
      getIdFocus() {
        showIdKeyboard.value = true
      },
      save() {
        loading.value = true
        if(!state.name || !state.id || !state.tel ) { Toast.fail('信息输入不全'); setTimeout(() => { loading.value = false }, 500); return }
        if (!checkId(state.id)) { Toast.fail('身份证号格式不正确'); setTimeout(() => { loading.value = false }, 500); return }
        if (!checkPhone(state.tel)) { Toast.fail('手机号格式不正确'); setTimeout(() => { loading.value = false }, 500); return }
        api.post("/myidcard/post", {
          itargetid: sessionStorage.getItem("id"),
          srealname: state.name,
          scardno: state.id,
          stelephone: state.tel,
        }).then((res) => {
          if(res.data.code === 20000) {
            sessionStorage.setItem('shiming', 1)
            Toast.success('认证成功')
            router.replace({ path: sessionStorage.getItem('shimingFrom')})
          } else { Toast.fail(res.data.msg) }
          setTimeout(() => { loading.value = false }, 200)
        })
      }
    }
  }
}
</script>