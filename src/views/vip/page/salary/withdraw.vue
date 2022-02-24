<template>
  <div class="relative pt-12 bg-white min-h-screen">

    <!-- header -->
    <muzi-header title="提现收益" />

    <div class="px-4 py-3.5 space-y-3.5">

      <div
        class="w-full rounded-md px-3 py-3.5 space-y-5"
        style="box-shadow: 0px 0px 3px 0px #999999"
      >
        <div class="flex items-center text-sm">
          <p>提现收益(港币)</p>
          <p class="ml-auto text-gray-600">余额：{{ data.balance }}港币</p>
        </div>
        <div class="flex items-center space-x-2">
          <p class="font-bold leading-none flex-shrink-0 text-gray-600">HK$</p>
          <p class="text-sm" :class="+data.price > 0 ? 'text-3xl font-bold' : 'text-gray-600'">
            {{ +data.price > 0 ? data.balance : '当前余额不能转出' }}
            <span v-if="+data.price > 0" class="text-base">港币</span>
            <span v-if="+data.price > 0" class="text-sm text-gray-600 ml-1">(约￥{{ +data.balanceRMB.toFixed(1) }})</span>
          </p>
        </div>
        <div>
          <p class="text-sm text-gray-800">预计七个工作日内到账</p>
          <div class="mt-4 text-xs text-gray-600 space-y-1">
            <p>扣除手续费{{ data.shouxufei }}元</p>
            <p>代扣代缴个人所得税{{ data.tax }}元</p>
            <p>实际到账{{ +data.price > 0 ? data.price : 0 }}元</p>
          </div>
        </div>
      </div>

      <div
        class="w-full rounded-md px-3 py-3.5 space-y-5"
        style="box-shadow: 0px 0px 3px 0px #999999"
      >
        <p class="text-sm">提现到银行卡</p>
        <div v-if="!form.cardnum" class="px-2 py-1">
          <van-button block plain color="#f23030" class="font-bold" @click="showPopup = true">＋ 添加本人银行卡</van-button>
        </div>
        <div v-else class="mt-5 flex items-center">
          <div class="w-10 h-10 bg-red-400 rounded-full flex items-center justify-center">
            <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="25" height="25"><path d="M968.909 301.773v-56.115c0-50.893-41.267-92.16-92.16-92.16H150.63c-50.892 0-92.16 41.267-92.16 92.16v56.115H968.91zm-910.439 51.2v425.523c0 50.893 41.268 92.16 92.16 92.16H876.75c50.893 0 92.16-41.267 92.16-92.16V352.973H58.47zm352.308 109.26H187.443c-14.131 0-25.6-11.468-25.6-25.6s11.469-25.6 25.6-25.6h223.335c14.13 0 25.6 11.47 25.6 25.6s-11.47 25.6-25.6 25.6zM868.3 750.439H756.634c-14.132 0-25.6-11.468-25.6-25.6s11.468-25.6 25.6-25.6H868.3c14.131 0 25.6 11.47 25.6 25.6s-11.469 25.6-25.6 25.6zm0-94.77H756.634c-14.132 0-25.6-11.47-25.6-25.6s11.468-25.6 25.6-25.6H868.3c14.131 0 25.6 11.468 25.6 25.6s-11.469 25.6-25.6 25.6z" fill="#fff"/></svg>
          </div>
          <div class="ml-4 flex-grow text-sm space-y-1" @click="showPopup = true">
            <p>{{ form.kaihuBank + '(' + +form.cardnum.slice(-4) +')' }}</p>
            <p class="text-gray-500">银行卡转入资金可提现</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" class="ml-auto flex-shrink-0 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
    <div class="mt-3 space-y-2.5 px-4">
      <div class="flex items-center space-x-2">
        <div class="w-0.5 h-3.5 bg-red-400 rounded" />
        <p class="text-sm font-bold">提现相关</p>
      </div>
      <div class="text-xs space-y-1.5">
        <p>高级经理每次提现收费标准如下：</p>
        <p>高级经理每次提现收取手续费50元/笔（人民币），提现金额超过5000港币（含5000）时免手续费。</p>
        <p>由于木子网采用港币结算，提现到个人账户为人民币，具体到账金额按实时汇率计算。</p>
        <p>高级经理的收益在提取时，由木子网运营单位代为缴纳个人所得税，具体税额按照《中华人民共和国个人所得税法》相关规定缴纳。</p>
        <p>如有专项附加扣除，请在个税汇缴期内（次年3月到6月）通过个人所得税APP办理年度汇算。如有变动，以税务最新文件为准。</p>
      </div>
    </div>
    <div class="mt-6 px-9">
      <van-button color="#f23030" round class="w-full" :disabled="btnDisabled" @click="withdraw">立即提现</van-button>
    </div>
    <!-- <p class="mt-3 text-xs text-gray-500 text-center">提示：提现收益标准为最低5000元，低于5000元不可提现</p> -->
    <div class="mt-1 text-center">
      <router-link 
        to="/vip/salary/withdraw/record" 
        class="w-24 text-red-400 text-sm text-center underline py-1 inline-block"
      >
        提现记录
      </router-link>
    </div>
    <van-popup v-model:show="showPopup" round closeable :style="{ width: '90%' }">
      <div class="px-4 py-6 bg-gray-200 h-full relative">
        <p class="text-center text-lg font-bold">{{ form.cardnum ? '编辑银行卡' : '添加银行卡' }}</p>
        <div class="mt-6 space-y-2">
          <!-- 银行卡号 -->
          <van-field 
            v-model="form.cardnum"
            type="number"
            label="银行卡号"
            label-width="70"
            clearable
            placeholder="请输入银行卡号"
          />
          <!-- 开户银行 -->
          <van-field 
            v-model="form.kaihuBank" 
            label="开户银行" 
            label-width="70"
            clearable
            placeholder="请输入开户银行" 
          />
          <!-- 持卡人姓名 -->
          <van-field
            v-model="form.kaihuMan"
            label="持卡人姓名"
            readonly
            label-width="70"
            clearable
            placeholder="持卡人真实姓名"
          />
        </div>
        <div class="mt-6 text-center">
          <button class="w-40 h-10 bg-red-400 text-white rounded-full" @click="confirm">确认</button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import api from '/src/api/index.js'
import { useRouter } from 'vue-router'
import { Popup, Toast } from 'vant'
import MuziHeader from '/src/components/MuziHeader.vue'
export default {
  components: {
    [Popup.name]: Popup,
    MuziHeader
  },
  setup() {
    const router = useRouter()
    const btnDisabled = ref(true)
    const showPopup = ref(false)
    const data = reactive({
      balance: '',
      balanceRMB: '',
      shouxufei: '',
      tax: '',
      price: ''
    })
    const form = reactive({
      cardnum: '',
      kaihuBank: '',
      kaihuMan: ''
    })
    api.get('/newB/getTiXian').then((res) => {
      if(res.data.code === 20000) {
        if(+res.data.data.shijidaozhang > 0) btnDisabled.value = false
        data.balance = res.data.data.balance
        data.balanceRMB = +res.data.data.balanceRMB
        data.tax = res.data.data.shuifei
        data.shouxufei = res.data.data.shouxufei
        data.price = res.data.data.shijidaozhang
        form.cardnum = res.data.data.cardnum,
        form.kaihuBank = res.data.data.kaihuBank,
        form.kaihuMan = res.data.data.kaihuMan
      }
    })
    return {
      btnDisabled,
      showPopup,
      data,
      form,
      confirm() {
        if(form.cardnum && form.kaihuBank && form.kaihuMan) {
          api.post('/newB/gototixiansavecard', form).then((res) => {
            if(res.data.code === 20000) {
              Toast.success('编辑成功')
              title.value = form.kaihuBank + '(' + form.cardnum.slice(-4) +')'
            } else {
              Toast.fail('编辑失败')
            }
          })
          showPopup.value = false
        } else {
          Toast.fail('信息不全')
        }
      },
      // 提现
      withdraw() {
        if(!form.cardnum) { Toast.fail('请添加本人银行卡'); return }
        if(!form.cardnum || !form.kaihuBank || !form.kaihuMan) { Toast.fail('信息不全，请完善信息'); return }
        btnDisabled.value = true
        api.post('/newB/gototixian', form).then((res) => {
          if(res.data.code === 20000) {
            router.replace('/vip/salary/withdraw/record')
            Toast.success('提现成功，预计7个工作日内到账')
          } else {
            Toast.fail(res.data.msg)
          }
          setTimeout( () => { btnDisabled.value = false }, 500 )
        })
      }
    }
  }
}
</script>