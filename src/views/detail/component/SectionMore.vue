<template>
  <section v-if="list.length > 0" class="p-4 rounded-2xl bg-white">
    <!-- title -->
    <div class="flex items-center space-x-1.5">
      <div class="w-1 h-4 rounded bg-red-400" />
      <h2 class="font-bold">更多推荐</h2>
    </div>
    <!-- content -->
    <div ref="scrollxRef" class="mt-4 overflow-x-scroll flex items-center space-x-3">
      <div v-for="item in list" :key="item.id" class="flex-shrink-0 rounded-md border w-32">
        <div @click="toDetail(item.id)">
          <van-image width="127" height="128" :src="item.simage1" :alt="item.stitle" lazy-load>
            <template #loading>
              <van-loading type="spinner" size="20" />
            </template>
          </van-image>
          <div class="px-2 pb-2">
            <p
              class="h-9 text-xs line-2 leading-normal"
            >
              {{ item.stitle }}
            </p>
            <p class="text-red-400 text-lg">
              {{ item.iprice }}<span class="text-xs ml-0.5">港币</span>
            </p>
            <div class="flex items-center justify-between text-xs text-gray-600">
              <p>{{ item.country }}</p>
              <p>已售{{ item.icountsale }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useRouter, useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import api from '/src/api/index.js'
export default {
  setup() {
    const router = useRouter()
    const route = useRoute()
    const list = ref([])
    const getList = function() {
      api.get("/open/product_detail/get_product_comment",{ id: route.params.id }).then((res) => { 
        list.value = res.data.data 
      })
    }
    getList()
    const scrollxRef = ref(null)
    watch(() => route.params, async newParams => {
      if(newParams.id) {
        getList()
        if(scrollxRef.value) { scrollxRef.value.scrollLeft = 0 }
      } 
    })
    return {
      list,
      scrollxRef,
      toDetail(id) { router.push({ path: '/detail/'+ id }) }
    }
  }
}
</script>
<style>
  .van-image__img{
    border-top-left-radius: 7px;
    border-top-right-radius: 7px;
  }
</style>
