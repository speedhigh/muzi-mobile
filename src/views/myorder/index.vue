<template>
  <div class="relative py-12">
    <muzi-header title="我的订单" custom-back @back="back" />
    <van-tabs
      v-model:active="active"
      @change="onChange"
      sticky
      :offset-top="48"
    >
      <van-tab
        v-for="item in tabTitles" 
        :key="item.id" 
        :name="item.id" 
        :title="item.title"
      >
        <div class="mt-3">
          <base-pagination
            url="/order/getpages"
            :params="params"
            size="8"
          >
            <template #default="slotProps">
              <div class="space-y-3">
                <div 
                  v-for="(msg,idx) in slotProps.list" 
                  :key="idx" 
                  class="bg-white rounded-2xl p-4"
                >
                  <order-card :msg="msg" />
                </div>
              </div>
            </template>
          </base-pagination>
        </div>
      </van-tab>
    </van-tabs>
    <base-totop />
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Empty } from 'vant'
import MuziHeader from '/src/components/MuziHeader.vue'
import OrderCard from './component/OrderCard.vue'
export default {
  components: {
    MuziHeader,
    [Empty.name]:Empty,
    OrderCard
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const showLoading = ref(true)
    const active = ref(route.query.state)
    const list = ref([])
    const params = ref({
      userid: sessionStorage.getItem('id'),
      state: active.value
    })
    const tabTitles = [
      { title: '全部', id: '0' },
      { title: '待付款', id: '1' },
      { title: '待发货', id: '2' },
      { title: '待收货', id: '3' },
      { title: '待评价', id: '5' }
    ]
    
    return {
      back() { router.replace('/user') },
      showLoading,
      tabTitles,
      list,
      params,
      active,
      onChange(value) {
        router.replace('/myorder?state=' + value)
        // params.value = {
        //   userid: sessionStorage.getItem('id'),
        //   state: value
        // }
      }
    }
  }
}
</script>