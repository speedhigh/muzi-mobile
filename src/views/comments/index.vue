<template>
  <div class="relative pt-12">
    <muzi-header title="商品评价" />
    <div class="space-y-3.5">
      <div class="rounded-b-2xl bg-white p-4 flex space-x-4">
        <van-image
          width="80"
          height="80"
          :src="img"
          lazy-load
          radius="7"
          alt="商品"
          class="flex-shrink-0"
        >
          <template #loading>
            <van-loading type="spinner" size="20" />
          </template>
        </van-image>
        <div class="flex-grow flex flex-col justify-between py-0.5">
          <p 
            class="h-9 overflow-hidden overflow-ellipsis text-sm" 
            style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; line-height:19px"
          >
            {{ title }}
          </p>
          <div class="flex items-center text-xs text-gray-600 space-x-2.5">
            <p>打分</p>
            <van-rate v-model="data.irank" color="#F23030" />
            <p>{{ rateText[data.irank - 1] }}</p>
          </div>
        </div>
      </div>
      <div class="rounded-t-2xl bg-white p-4 space-y-4">
        <p class="text-sm">快来写下你的评价吧 ~</p>
        <div class="w-full h-64 min-w-full border border-dashed border-gray-500 rounded-lg">
          <van-field
            v-model="data.smemo"
            rows="2"
            :autosize="{ minHeight: 200, maxHeight: 200 }"
            type="textarea"
            maxlength="200" 
            placeholder="请写下您的评价..."
            show-word-limit
            @blur="toTop"
            @focus="toTop"
          />
        </div>
        <div class="py-8">
          <van-button block round color="#F23030" @click="submit">发布</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'
import api from '/src/api/index.js'
import { useRoute, useRouter } from 'vue-router'
import { Rate, Toast } from 'vant'
import MuziHeader from '/src/components/MuziHeader.vue'
export default {
  components: {
    MuziHeader,
    [Rate.name]:Rate
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const title = route.query.title
    const img = route.query.img
    const rateText = ['非常差','差','一般','好','非常好']
    const data = reactive({
      iuserid: sessionStorage.getItem('id'),
      itargetid: route.params.id,
      iorderid: route.query.orderId,
      irank: 5,
      smemo: '',
    })
    return {
      title,
      img,
      rateText,
      data,
      toTop() { window.scrollTo({ top: 0, behavior: "instant" }) },
      submit() {
        api.post("/usercomment/post", data).then((res) => {
          if(res.data.code === 20000) {
            Toast.success('评价成功')
            router.go(-1)
          }
        })
      }
    }
  }
}
</script>