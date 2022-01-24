<template>
  <section class="p-4 rounded-2xl bg-white">
    <!-- title -->
    <div class="flex items-center space-x-1.5">
      <div class="w-1 h-4 rounded bg-red-400" />
      <h2 class="font-bold">产品详情</h2>
    </div>
    <!-- content -->
    <div class="mt-4">
      <div v-for="(item, index) in list" :key="index">
        <van-image width="100%" height="100%" :src="item.img" alt="产品详情" lazy-load @click="toDetail(item.id)">
          <template #loading>
            <van-loading type="spinner" size="20" />
          </template>
        </van-image>
      </div>
    </div>
  </section>
</template>

<script>
import api from '/src/api/index.js'
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
export default {
  setup() {
    const router = useRouter()
    const route = useRoute()
    const list = ref([])
    const getList = function() {
      api.get("/open/product_detail/get_product_detail_image",{ productId: route.params.id }).then((res) => {
        list.value = res.data.data.images 
      })
    }
    getList()
    watch(() => route.params, async newParams => { if(newParams.id) getList() })
    return {
      list,
      toDetail(id) {
        if(id > 0) { router.push({ path: '/detail/'+ id }) }  
      }
    }
  }
}
</script>
