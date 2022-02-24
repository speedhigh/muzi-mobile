<template>
  <div class="relative py-12 min-h-screen">
    <!-- header -->
    <header class="fixed top-0 max-w-md w-full h-12 bg-white z-50 flex items-center pr-4 py-2 shadow-b">
      <!-- back -->
      <div class="px-4" @click="back">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </div>
      <!-- search -->
      <div class="flex-grow h-full">
        <div class="h-full flex items-center space-x-2.5 px-3 bg-gray-200 text-gray-500 rounded-2xl" @click="search">
          <van-icon name="search" />
          <p class="text-xs">
            {{ params.searchContent ? params.searchContent : '请输入您要搜索的药品、品牌' }}
          </p>
        </div>
      </div>
      <p class="ml-3 text-sm flex-shrink-0">搜索</p>
    </header>
    <!-- list -->
    <div class="mt-3 px-4">
      <base-pagination
        url="/open/home/search"
        :params="params"
        size="10"
        empty-img="search"
        description-tips="暂无内容"
      >
        <template #default="slotProps">
          <div class="w-full grid grid-cols-2 gap-x-3 gap-y-3">
            <div v-for="item in slotProps.list" :key="item.id">
              <muzi-card :msg="item" @click="toDetail(item.id)" />
            </div>
          </div>
        </template>
      </base-pagination>
    </div>
    <base-totop />
  </div>
</template>

<script>
import { ref } from 'vue'
import MuziCard from '../../components/MuziCard.vue'
import { useRoute,useRouter } from 'vue-router'
import BaseTotop from '../../components/global/BaseTotop.vue'
export default {
  components: {
    MuziCard,
    BaseTotop
  },
  setup() {
    window.scroll(0,0)
    const router = useRouter()
    const route = useRoute()
    const params = ref({
      searchContent: route.query.drug,
      sclass: route.query.id,
      countryCode: route.query.countryCode,
      onefunctioncategory: route.query.secondClass
    })
    return {
      params,
      back() { router.push({ path: sessionStorage.getItem('searchFrom') }) },
      toDetail(id) { router.push({ path: '/detail/'+ id }) },
      search() { router.push({ path:'/search' })}
    }
  }
}
</script>