<template>
  <section class="rounded-2xl bg-white" :class="showAll ? 'px-4 pt-4 pb-12' : 'p-4'">
    <!-- title -->
    <div class="flex items-center">
      <div class="w-1 h-4 rounded bg-red-400" />
      <h2 class="font-bold mx-1.5">评价</h2>
      <p v-if="total > 0" class="text-xs text-gray-600">(共{{ total }}条)</p>
      <div v-if="total > 0 && !showAll" class="ml-auto flex items-center text-sm text-gray-500" @click="toComment">
        <p>查看更多</p>
        <van-icon name="arrow" />
      </div>
    </div>
    <!-- content -->
    <div class="mt-4">
      <div v-if="list.length > 0" :class="showAll ? 'space-y-8' : 'space-y-4'">
        <div v-for="(item, index) in list" :key="index">
          <div class="flex items-center space-x-2">
            <van-image width="35" height="35" :src="avatar" alt="avatar" round lazy-load />
            <div>
              <p class="text-sm">用户{{ item.userName }}</p>
              <span class="text-xs text-gray-600 mr-1.5">{{ item.time }}</span>
              <van-rate v-model="item.irank" :size="10" readonly color="#f23030" />
            </div>
          </div>
          <p v-if="item.smemo && !showAll" class="mt-2 h-10 line-2 text-sm">{{ item.smemo }}</p>
          <p v-else-if="item.smemo && showAll" class="text-sm mt-2">{{ item.smemo }}</p>
          <div v-else class="mt-2 text-sm">默认好评</div>
        </div>
      </div>
      <div v-else class="text-sm">当前商品暂无评价</div>
    </div>
  </section>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import { Rate } from 'vant'
import avatar from '/src/assets/images/avatar.webp'
export default {
  components: {
    [Rate.name]: Rate
  },
  props: {
    list: {
      type: Array,
      required: true
    },
    showAll: {
      type: Boolean,
      default: false
    },
    total: {
      type: Number,
      default: 0
    }
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    return {
      avatar,
      toComment() {
        router.push({ path:'/detail/comment/' + route.params.id })
      }
    }
  }
}
</script>