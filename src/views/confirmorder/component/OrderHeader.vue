<template>
  <muzi-header title="确认订单" custom-back @back="back" />
</template>

<script>
import api from '/src/api/index.js'
import { useRouter, useRoute } from 'vue-router'
import { Dialog } from 'vant'
import MuziHeader from '/src/components/MuziHeader.vue'
export default {
  components: {
    MuziHeader
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    return {
      // 返回()
      back() {
        Dialog.confirm({
          confirmButtonText: '继续支付',
          cancelButtonText: '暂时放弃',
          title: '确定要放弃付款吗?'
        }).then(() => {
          // ……
        }).catch(() => {
          // 清除购物券的后端存储
          api.get('/quan/clearquanstorage', { userid: sessionStorage.getItem('id') })
          // 如果是从详情页面来的，要清空数量存储数据
          if(route.query.from === 'detail') {
            api.get("/pay/clearstorage", {
              userid: sessionStorage.getItem('id'),
              pid: sessionStorage.getItem('drugId'),
            })
          }
          router.go(-1)
        })
      },
    }
  }
}
</script>