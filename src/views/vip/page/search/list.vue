<template>
  <div class="relative pt-24 min-h-screen bg-white">

    <!-- header -->
    <header class="fixed top-0 max-w-md w-full bg-white z-50 pt-2">
      <div class="w-full h-11 flex items-center pr-4">
        <!-- back -->
        <div class="px-4" @click="back">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </div>
        <!-- search(搜索页搜索进入) -->
        <div v-if="!params.name" class="flex-grow h-[1.88rem]">
          <div class="h-full flex items-center space-x-2.5 px-3 bg-gray-200 text-gray-500 rounded-md" @click="search">
            <van-icon name="search" />
            <p class="text-xs">
              {{ params.title ? params.title : '请输入您要搜索的药品、品牌' }}
            </p>
          </div>
        </div>
        <p v-if="!params.name" class="ml-3 text-sm flex-shrink-0">搜索</p>
        <!-- search(首页分类进入) -->
        <div v-if="params.name" class="flex-grow w-full text-center text-lg">
          {{ title }}
        </div>
        <div v-if="params.name" class="pl-3 pr-2 flex-shrink-0" @click="search">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      <!-- menu -->
      <vip-menu @change="changeMenu" @change2="changeDto" />
    </header>

    <!-- list -->
    <div class="mt-3 px-4">
      <!-- 1 -->
      <base-pagination
        v-if="status === 1"
        url="/open/newB/searchByProBrandSku"
        :params="params"
        size="15"
      >
        <template #default="slotProps">
          <div class="space-y-4">
            <div v-for="item in slotProps.list" :key="item.id">
              <vip-card :msg="item" />
            </div>
          </div>
        </template>
      </base-pagination>
      <!-- 2 -->
      <base-pagination
        v-if="status === 2"
        url="/open/newB/searchByClazzBrand"
        :params="params2"
        size="15"
      >
        <template #default="slotProps">
          <div class="space-y-4">
            <div v-for="item in slotProps.list" :key="item.id">
              <vip-card :msg="item" />
            </div>
          </div>
        </template>
      </base-pagination>
    </div>
    <base-totop :threshold="200" />
  </div>
</template>

<script>
import { ref, onActivated, computed, onMounted } from 'vue'
import { useRoute,useRouter } from 'vue-router'
import VipMenu from '../../components/VipMenu.vue'
import VipCard from '../../components/VipCard.vue'
import BaseTotop from '../../../../components/global/BaseTotop.vue'
export default {
  components: {
    BaseTotop,
    VipMenu,
    VipCard
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const status = ref(1)
    const params = ref({
      title: route.query.drug,
      name: route.query.name ? route.query.name : '',  // 空字符串代表搜索所有,非空需要传 otc 或者 chufang
      type: 'time',
      shunxu: -1
    })
    const params2 = ref({
      firstnav: '',
      secondnav: '',
      brandid: 0,
      name: route.query.name ? route.query.name : '', 
      type: '',
      shunxu: -1
    })
    const title = computed(() => {
      if(route.query.name === 'jiating') return '家庭常备药'
      if(route.query.name === 'shangban') return '上班一族常备药'
      if(route.query.name === 'nvxing') return '女性儿童常备药'
      if(route.query.name === 'jiating') return '家庭常备药'
      if(route.query.name === 'hot') return '热销药品'
      if(route.query.name === 'common') return '非专属药品'
      if(route.query.name === 'otc') return 'OTC药品'
      if(route.query.name === 'chufang') return '处方药品'
      return ''
    })
    onMounted(() => {
      window.scrollTo(0, 0)
    })
    onActivated(() => {
      // status.value = 1
      // params.value.type = 'time'
      params.value.name = route.query.name ? route.query.name : ''
    })
    return {
      status,
      params,
      params2,
      title,
      back() { router.replace('/vip') },
      search() {
        if(!route.query.name) {
          router.push({ path:'/vip/search' })
        } else {
          router.push({ path:'/vip/search', query: { name: route.query.name } })
        }
      },
      changeMenu(state, msg) {
        if(state === 1) {
          window.scrollTo(0, 0) 
          params.value = Object.assign(params.value, msg)
        }
      },
      changeDto(msg) {
        window.scrollTo(0, 0) 
        params2.value = Object.assign(params2.value, msg)
        status.value = 2
      }
    }
  }
}
</script>