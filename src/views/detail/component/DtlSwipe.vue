<template>
  <base-square>
    <div class="w-full h-full bg-white">
      <van-swipe ref="swipeRef" class="w-full h-full bg-gray-400" :autoplay="5000" indicator-color="#f23030" lazy-render>
        <van-swipe-item v-for="image in list" :key="image" class="w-full h-full">
          <img :src="image" class="w-full h-full" alt="轮播图" @click="clickImg(index)">
        </van-swipe-item>
      </van-swipe>
    </div>
  </base-square>
  <van-image-preview v-model:show="showPreview" :images="imgList" :start-position="startPosition" />
</template>

<script>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from '/src/api/index.js'
import { ImagePreview, Swipe, SwipeItem } from 'vant'
export default {
  components: {
    [Swipe.name]:Swipe,
    [SwipeItem.name]:SwipeItem,
    [ImagePreview.Component.name]:ImagePreview.Component
  },
  setup() {
    const route = useRoute()
    const list = ref([])
    const getList = function() {
      api.get("/open/product_detail/get_product_images", { id: route.params.id }).then((res) => {
        list.value = res.data.data
      })
    }
    getList()
    const showPreview = ref(false)
    const imgList = ref([])
    const startPosition = ref(0)
    const swipeRef = ref(null)
    watch(() => route.params, async newParams => {
      if(newParams.id) {
        getList()
        swipeRef.value.swipeTo(0)
      } 
    })
    return {
      list,
      getList,
      showPreview,
      imgList,
      startPosition,
      swipeRef,
      clickImg(index) {
        showPreview.value = true
        imgList.value = list.value
        startPosition.value = index
      }
    }
  }
}
</script>