<template>
  <section class="w-full bg-white rounded-lg px-4">
    <div 
      v-for="(item, index) in list" 
      :key="index" 
      class="py-4 border-b border-gray-300 last:border-white flex items-center text-sm"
      @click="clickMenu(item)"
    >
      <p>{{ item.name }}</p>
      <van-icon name="arrow" class="ml-auto" />
    </div>
  </section>
</template>

<script>
import { Toast } from 'vant'
import { useRouter } from 'vue-router'
export default {
  setup() {
    const router = useRouter()
    const list = [
      {
        name: '编码查询',
        url: '',
      },
      {
        name: '用户须知',
        url: '/user/notice',
      },
      {
        name: '购物指南',
        url: '/user/guide',
      },
      {
        name: '物流配送',
        url: '/user/logistics',
      }
    ]
    return {
      list,
      clickMenu(item) {
        if(item.name === '编码查询') {
          Toast({
            message: '功能即将上线',
            icon:'scan'
          });
        } else {
          router.push({ path: item.url }) 
        }
      }
    }
  }
}
</script>
