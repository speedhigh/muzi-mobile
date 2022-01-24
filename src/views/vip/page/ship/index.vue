<template>
  <div class="relative pt-12 min-h-screen">
    <muzi-header title="物流信息" />
    <main v-if="list.length > 0" class="space-y-3.5">
      <!-- 物流信息 -->
      <section class="bg-white p-4 rounded-b-2xl">
        <div class="w-full flex space-x-4">
          <van-image
            width="100"
            height="100"
            :src="data.img"
            lazy-load
            radius="7"
            class="flex-shrink-0 relative"
          >
            <template #loading>
              <van-loading type="spinner" size="20" />
            </template>
            <div 
              class="absolute bottom-0 h-4 inset-x-0 text-center text-xs text-white" 
              style="background-color:rgba(0,0,0,0.6)"
            >
              共{{ data.sum }}件商品
            </div>
          </van-image>
          <div class="flex-grow text-xs flex flex-col justify-between py-1">
            <p>订单状态：{{ data.status }}</p>
            <p>物流公司：{{ data.company }}</p>
            <p>运单号码：{{ data.swaybillnum }}</p>
            <p>订单号：{{ data.orderid }}</p>
          </div>
        </div>
      </section>
      <!-- 地址信息 -->
      <section class="p-4 bg-white rounded-2xl">
        <div class="flex items-center mb-2">
          <p>{{ address.name }} {{ address.tel }}</p>
        </div>
        <div 
          class="max-h-9 overflow-hidden overflow-ellipsis" 
          style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; font-size:13px; line-height: 18px"
        >
          {{ address.address }} {{ address.sdetail }}
        </div>
      </section>
      <!-- 物流详情信息 -->
      <section class="p-4 bg-white rounded-2xl">
        <van-steps direction="vertical" :active="0">
          <van-step v-for="(item, index) in list" :key="index">
            <h3>{{ item.sdesc }}</h3>
            <p>{{ item.dinserttimestr }}</p>
          </van-step>
        </van-steps>
      </section>
    </main>
    <!-- empty -->
    <van-empty v-else description="暂无物流信息" class="mt-36" />
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
import { ref, reactive } from 'vue'
import api from '/src/api/index.js'
import { Empty, Step, Steps } from 'vant'
import MuziHeader from '/src/components/MuziHeader.vue'
export default {
  components: {
    MuziHeader,
    [Empty.name]:Empty,
    [Steps.name]:Steps,
    [Step.name]:Step,
  },
  setup() {
    const route = useRoute()
    // 物流信息
    const data = reactive({
      img: route.params.img,
      sum: route.params.sum,
      status: '',
      company: '',
      swaybillnum: '',
      orderid: route.params.id
    })
    // 地址信息
    const address = reactive({
      name: route.params.name,
      tel: route.params.tel,
      address: route.params.address,
      sdetail: route.params.sdetail
    })
    // 物流详情
    const list = ref([])
    api.get("/ship/get", { orderid: route.params.id } ).then((res) => { 
      if(res.data.code === 20000) {
        data.company = res.data.data.sname
      }
    })
    api.get("/ship/getList", { orderid: route.params.id } ).then((res) => {
      if(res.data.code === 20000 && res.data.data.length > 0) {
        data.status = res.data.data[0].iwaybillstatus
        data.swaybillnum = res.data.data[0].swaybillnum
        list.value = res.data.data
      }
    })
    return {
      data,
      address,
      list
    }
  }
}
</script>
