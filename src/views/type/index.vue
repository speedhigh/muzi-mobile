<template>
  <div class="relative py-12 bg-white">
    <!-- header -->
    <type-header />
    <!-- loading -->
    <van-loading v-show="showLoading" size="32px" vertical class="mt-8"> 
      加载中，请稍后... 
    </van-loading>
    <!-- main -->
    <div v-if="!showLoading && content.length > 0" class="flex">
      <!-- nav -->
      <div class="h-screen relative" style="width:30%">
        <div class="py-4 space-y-8 fixed w-full max-w-[120px]">
          <div v-for="i in content.length" :key="i" class="flex items-center justify-center">
            <img v-if="i-1 === sIndex" :src="selImg" class="w-6 h-6" alt="selImg">
            <p
              class="text-center text-sm"
              :class="i-1 === sIndex ? 'font-bold -ml-2' : 'font-medium'"
              @click="changeCountry(i-1)"
            >
              {{ content[i-1].sname }}
            </p>
          </div>
        </div>
      </div>
      <!-- boundary(分割线) -->
      <div 
        class="w-1 min-h-screen flex-shrink-0"
        style="background: linear-gradient(90deg, rgba(230, 230, 230, 0.5) 0%, rgba(245, 245, 245, 0) 100%)" 
      />
      <!-- content -->
      <div class="p-4 ml-auto w-[70%]">
        <base-square ar="39">
          <van-image
            width="100%"
            height="100%"
            :src="countryImg[content[sIndex].scountry]"
            radius="7"
            lazy-load
            alt="country"
          >
            <template #loading>
              <van-loading type="spinner" size="20" />
            </template>
          </van-image>
        </base-square>
        <div
          v-for="(item,index) in content[sIndex].navClassSecModuleVOList"
          :key="index"
          class="mt-4 border-b border-gray-400 last:border-white"
        >
          <div class="pb-5">
            <h2 class="text-sm font-bold">{{ item.title }}</h2>
            <div class="mt-2 grid grid-cols-3 gap-x-2 gap-y-3">
              <div v-for="msg in item.content" :key="msg.sfuncid">
                <div @click="toList(content[sIndex].scountry,msg.sfuncid)">
                  <base-square>
                    <van-image
                      width="100%"
                      height="100%"
                      :src="msg.simage"
                      radius="7"
                      fit="cover"
                      :alt="msg.sname"
                      lazy-load
                    >
                      <template #loading>
                        <van-loading type="spinner" size="20" />
                      </template>
                    </van-image>
                  </base-square>
                  <p class="mt-1 h-8 line-2 text-xs">{{ msg.sname }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- footer -->
    <muzi-footer :footer-index="1" />
  </div>
</template>

<script>
import { ref } from 'vue';
import api from '/src/api/index.js'
import { useRouter } from 'vue-router'
import japanImg from '/src/assets/images/country/01.webp'
import koreaImg from '/src/assets/images/country/02.webp'
import IndiaImg from '/src/assets/images/country/03.webp'
import thailandImg from '/src/assets/images/country/05.webp'
import singaporeImg from '/src/assets/images/country/06.webp'
import selImg from '/src/assets/images/sel.webp'
import TypeHeader from './component/TypeHeader.vue'
import MuziFooter from '/src/components/MuziFooter.vue'
export default {
  components: {
    TypeHeader,
    MuziFooter
  },
  setup() {
    const router = useRouter()
    const showLoading = ref(true)
    const sIndex = ref(0)
    const content = ref([])
    api.get("/open/home/get_nav_class").then((res)=>{
      content.value = res.data.data
      showLoading.value = false
    })
    const countryImg = {
      '01': japanImg,
      '02': koreaImg,
      '03': IndiaImg,
      '05': thailandImg,
      '06': singaporeImg
    }
    return {
      showLoading,
      countryImg,
      selImg,
      sIndex,
      content,
      changeCountry(index) {
        sIndex.value = index
        window.scrollTo(0,0)
      },
      toList(countryId,sfuncid) {
        sessionStorage.setItem('searchFrom','/type')
        router.push({ path:'/search/list', query: { countryCode: countryId, secondClass: sfuncid } })
      }
    }
  }
}
</script>