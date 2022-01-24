<template>
  <div class="relative py-12 min-h-screen bg-white">
    <!-- header/search -->
    <div class="fixed top-0 max-w-md w-full px-4 flex items-center z-50">
      <div @click="back">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </div>
      <van-search
        v-model="searchValue"
        show-action
        placeholder="请输入药品、品牌或SKU"
        class="w-full"
        maxlength="15"
        @search="onSearch"
      >
        <template #action>
          <div @click="onSearch(searchValue)">搜索</div>
        </template>
      </van-search>
    </div>
    <!-- main -->
    <div class="p-4">
      <!-- 历史搜索 -->
      <div v-if="historyList.length > 0 && showHistory">
        <div class="flex items-center">
          <p class="text-sm font-bold">历史搜索</p>
          <div class="ml-auto p-2" @click="deleteHistory">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
        </div>
        <div class="flex flex-wrap items-center">
          <template v-for="(item,index) in historyList" :key="index">
            <button
              v-if="item.length > 0"
              class="my-1.5 mr-3.5 py-1 px-3 bg-gray-200 text-gray-500 rounded text-xs"
              @click="onSearch(item)"
            >
              {{ item }}
            </button>
          </template>
        </div>
      </div>
      <!-- 搜索推荐 -->
      <div class="mt-2">
        <p class="text-sm font-bold p-2">搜索推荐</p>
        <div class="flex flex-wrap items-center">
          <template v-for="item in hotList" :key="item">
            <button class="my-1.5 mr-3.5 py-1 px-3 bg-gray-200 text-gray-500 rounded text-xs" @click="onSearch(item)">
              {{ item }}
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { Dialog, Search } from 'vant'
import { uniq } from 'lodash'
import { useRouter, useRoute } from 'vue-router'
export default {
  components: {
    [Search.name]:Search
  },
  setup() {
    const showHistory = ref(localStorage.getItem('history')? true:false)
    const historyList =  ref(localStorage.getItem('history') ? uniq(localStorage.getItem('history').split(',')) : [])
    if(historyList.value.length > 10) historyList.value.splice(10)
    const hotList = ref(['感冒药','更年期保健药','胃药','咽喉消炎','眼药水','大幸药品','小林制药','乐敦制药'])
    const router = useRouter()
    const route = useRoute()
    const searchValue = ref('')
    return {
      showHistory,
      historyList,
      hotList,
      searchValue,
      // 返回
      back() { router.go(-1) },
      // 搜索
      onSearch(value) {
        historyList.value.unshift(value)
        localStorage.setItem('history',historyList.value)
        if(!route.query.name) {
          router.push({ path: '/vip/search/list', query: { drug: value }})
        } else {
          router.push({ path: '/vip/search/list', query: { name: route.query.name ,drug: value }})
        }
      },
      // 清空历史记录
      deleteHistory() {
        Dialog.confirm({
          title:'确认删除全部历史记录？'
        }).then(() => {
          localStorage.removeItem('history')
          showHistory.value = false
          historyList.value = []
        }).catch(() => { /**/ })
      }
    }
  }
}
</script>