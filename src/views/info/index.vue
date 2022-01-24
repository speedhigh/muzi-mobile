<template>
  <div class="relative pt-12 pb-8 bg-gray-100 min-h-screen">
    <!-- header -->
    <muzi-header title="完善信息" />
    <van-form validate-trigger="onSubmit" class="px-4 space-y-7" @submit="onSubmit">
      <div class="mt-4">
        <!-- 真实姓名 -->
        <van-field
          v-model="form.realname"
          label="真实姓名"
          label-width="4rem"
          placeholder="请填写真实姓名"
          :rules="rules.realname"
        />
        <!-- 身份证号 -->
        <van-field
          v-model="form.realcardno"
          label="身份证号"
          maxlength="18"
          label-width="4rem"
          placeholder="请填写身份证号"
          :rules="rules.realcardno"
        />
        <!-- 手机号 -->
        <van-field
          v-model="form.realmobile"
          maxlength="11"
          label="手机号"
          label-width="4rem"
          placeholder="请填写您的手机号"
          :rules="rules.realmobile"
        />
      </div>
      <div>
        <div class="flex items-center space-x-2 mb-4">
          <div class="w-0.5 h-4 rounded bg-red-400" />
          <p class="font-bold">收货地址</p>
        </div>
        <!-- 收货人 -->
        <van-field
          v-model="form.slinkman"
          label="收货人"
          label-width="4rem"
          placeholder="请填写真实姓名"
          :rules="rules.slinkman"
        />
        <!-- 手机号码 -->
        <van-field
          v-model="form.addressmobile"
          label="手机号码"
          maxlength="11"
          label-width="4rem"
          placeholder="请填写收货人手机号"
          :rules="rules.addressmobile"
        />
        <!-- 身份证号 -->
        <van-field
          v-model="form.addresscardno"
          label="身份证号"
          maxlength="18"
          label-width="4rem"
          placeholder="请填写收货人真实身份证号"
          :rules="rules.addresscardno"
        />
        <!-- 所在地区 -->
        <van-field
          v-model="form.addresscode"
          label-width="4rem"
          label="所在地区"
          readonly
          is-link
          placeholder="选择 省 / 市"
          @click="area.show = true"
          :rules="rules.addresscode"
        />
        <van-popup v-model:show="area.show" position="bottom" round>
          <van-picker 
            title="选择地区"
            :columns="area.list" 
            :columns-field-names="{ text: 'label', values: 'values', children: 'children' }" 
            @confirm="confirmArea" 
            @cancel="area.show = false" 
          />
        </van-popup>
        <!-- 详细地址 -->
        <van-field
          v-model="form.addressdetail"
          label="详细地址"
          label-width="4rem"
          placeholder="街道、楼牌号等"
          :rules="rules.addressdetail"
        />
      </div>
      <van-button round block color="#f23030" :disabled="submitDisabled" native-type="submit">保存并使用</van-button>
    </van-form>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Picker, Popup, Toast } from 'vant'
import api from '/src/api/index.js'
import MuziHeader from '/src/components/MuziHeader.vue'
export default {
  components: {
    MuziHeader,
    [Picker.name]:Picker,
    [Popup.name]:Popup,
  },
  setup() {
    const router = useRouter()
    const form = reactive({
      realname: "",       // 名字
      realcardno: "",     // 身份证号
      realmobile: "",     // 手机号
      slinkman: "",       // 收货人
      addressmobile: "",  // 收货人手机号
      addresscardno: "",  // 收货人身份证号
      addresscode: "",    // 所在地区
      addressdetail: "",  // 详细地址
    })
    const rules = reactive({
      realname: [{ required: true, message: '请输入您的真实姓名', }],
      realcardno: [{
        required: true,
        message: '请输入正确的身份证号',
        validator: value => { return /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value) }
      }],
      realmobile: [{
        required: true,
        message: '请输入正确的手机号',
        validator: value => { return 11 && /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/.test(value) }
      }],
      slinkman: [{ required: true, message: '请输入收货人姓名' }],
      addressmobile: [{
        required: true,
        message: '请输入正确的手机号',
        validator: value => { return 11 && /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/.test(value) }
      }],
      addresscardno: [{
        required: true,
        message: '请输入正确的身份证号',
        validator: value => { return /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value) }
      }],
      addresscode: [{ required: true, message: '请选择所在地区' }],
      addressdetail: [{ required: true, message: '请输入详细地址' }]
    })
    const area = reactive({
      show: false,
      list: [],
      cityscode: ''
    })
    api.get("/open/common/get_address_select" ).then((res)=>{
      area.list = res.data.data 
    })
    const submitDisabled = ref(false)
    return {
      form,
      rules,
      area,
      submitDisabled,
      confirmArea(value) {
        form.addresscode = '中国 '+ value[0].label + ' ' + value[1].label
        area.cityscode = value[1].value
        area.show = false
      },
      // back() {
      //   if(sessionStorage.getItem('infoFrom')) {
      //     router.replace({ path: sessionStorage.getItem('infoFrom')})
      //   } else {
      //     router.replace('/')
      //   }
      // },
      onSubmit() {
        submitDisabled.value = true
        let data = {
          realname: form.realname,                  // 名字
          realcardno: form.realcardno,              // 身份证号
          realmobile: form.realmobile,              // 手机号
          slinkman: form.slinkman,                  // 收货人
          addressmobile: form.addressmobile,        // 收货人手机号
          addresscardno: form.addresscardno,        // 收货人身份证号
          addresscode: area.cityscode,              // 所在地区
          addressdetail: form.addressdetail, 
        }
        api.post('/myidcard/postAddressAndReal', data).then((res) => {
          if(res.data.code === 20000) {
            sessionStorage.setItem('shiming', 1)
            Toast.success(res.data.msg)
            if(sessionStorage.getItem('infoFrom')) {
              router.replace(sessionStorage.getItem('infoFrom'))
              sessionStorage.removeItem('infoFrom')
            } else {
              router.replace('/')
              sessionStorage.removeItem('infoFrom')
            }
          } else { Toast.fail(res.data.msg) }
          setTimeout( () => { submitDisabled.value = false }, 200 )
        })
      }
    }
  }
}
</script>