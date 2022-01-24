<template>
  <div class="pt-12 relative bg-white">
    <muzi-header title="提现记录" />
    <div v-if="list.length > 0" class="px-4 py-1">
      <div v-for="(item, index) in list" :key="index" class="flex items-center py-4 border-b border-gray-300">
        <div class="flex-grow space-y-2">
          <p class="text-sm">提现 <span class="ml-5" :class="textStyle(item.shuoming)">({{ item.shuoming }})</span></p>
          <p class="text-xs text-gray-600">{{ item.shijian }}</p>
        </div>
        <div class="ml-auto flex-shrink-0 text-[1.38rem]">{{ item.money }}</div>
      </div>
    </div>
    <div v-else class="mt-36">
      <van-empty description="暂无记录" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import api from '/src/api/index.js'
import { Empty } from 'vant'
import MuziHeader from '/src/components/MuziHeader.vue'
export default {
  components: {
    [Empty.name]: Empty,
    MuziHeader
  },
  setup() {
    const list = ref([])
    api.get('/newB/getTiXianRecord').then((res) => {
      list.value = res.data.data
    })
    return {
      list,
      textStyle(text) {
        if(text === '提现成功') return 'text-[#3BC089]'
        if(text === '提现失败') return 'text-red-400'
        if(text === '审核中') return 'text-origin-400'
      }
    }
  }
}
</script>

<style>

</style>