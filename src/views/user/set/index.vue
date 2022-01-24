<template>
  <div class="relative pt-12 min-h-screen bg-white">
    <muzi-header title="账户设置" />
    <div class="px-4 py-2">
      <!-- 地址管理 -->
      <router-link to="/address?switchable=true">
        <div class="py-5 flex items-center border-b border-gray-300 text-sm">
          <p>地址管理</p>
          <van-icon name="arrow" color="#999999" class="ml-auto" />
        </div>
      </router-link>

      <!-- 实名认证 -->
      <div class="py-5 flex items-center border-b border-gray-300 text-sm" @click="toShiMing">
        <p>实名认证</p>
        <van-icon name="arrow" color="#999999" class="ml-auto" />
      </div>

      <!-- 手机号改绑
      <div class="py-5 flex items-center border-b border-gray-300 text-sm">
        <p>手机号改绑</p>
        <van-icon name="arrow" color="#999999" class="ml-auto" />
      </div>
      -->

      <!-- 密码修改 -->
      <router-link to="/login/changepwd">
        <div class="py-5 flex items-center border-b border-gray-300 text-sm">
          <p>密码修改</p>
          <van-icon name="arrow" color="#999999" class="ml-auto" />
        </div>
      </router-link>

      <!-- 售后服务 -->
      <div class="py-5 flex items-center border-b border-gray-300 text-sm" @click="showServe = true">
        <p>售后服务</p>
        <van-icon name="arrow" color="#999999" class="ml-auto" />
      </div>
      <van-action-sheet v-model:show="showServe" :actions="serveList" cancel-text="取消" @select="selectServe" @cancel="showServe = false" />

      <!-- 关于我们 -->
      <div class="py-5 flex items-center border-b border-gray-300 text-sm" @click="showAbout = true">
        <p>关于我们</p>
        <van-icon name="arrow" color="#999999" class="ml-auto" />
      </div>
      <van-action-sheet v-model:show="showAbout" :actions="aboutList" cancel-text="取消" @select="selectAbout" @cancel="showAbout = false" />

      <!-- 隐私条款 -->
      <div class="py-5 flex items-center border-b border-gray-300 text-sm" @click="toArticle('隐私条款','ystk')">
        <p>隐私条款</p>
        <van-icon name="arrow" color="#999999" class="ml-auto" />
      </div>

      <!-- 服务条款 -->
      <div class="py-5 flex items-center border-b border-gray-300 text-sm" @click="toArticle('服务条款','advice')">
        <p>服务条款</p>
        <van-icon name="arrow" color="#999999" class="ml-auto" />
      </div>
    </div>
    <div class="p-12">
      <van-button block round color="#F23030" @click="quit">退出登录</van-button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ActionSheet, Toast } from 'vant'
import MuziHeader from '/src/components/MuziHeader.vue'
export default {
  components: {
    [ActionSheet.name]:ActionSheet,
    MuziHeader
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    // 售后服务
    const showServe = ref(false)
    const serveList = [
      { name: '退货政策', value: 'refundpolicy' },
      { name: '退货流程', value: 'thlc' },
      { name: '退货说明', value: 'tksm' }
    ]
    // 关于我们
    const showAbout = ref(false)
    const aboutList = [
      { name: '关于我们', value: 'aboutus' },
      { name: '药商资质', value: 'certifcate' },
      { name: '联系我们', value: 'contact' }
    ]
    return {
      toShiMing() {
        sessionStorage.setItem('shimingFrom', route.path) 
        router.push({ path: '/shiming' }) 
      },
      showServe,
      serveList,
      selectServe(item) {
        showServe.value = false;
        router.push({ path: '/user/set/refund', query: { title: item.name, content: item.value} })
      },
      showAbout,
      aboutList,
      selectAbout(item) {
        showAbout.value = false
        router.push({ path: '/user/set/about', query: { title: item.name, content: item.value} })
      },
      toArticle(title, content) {
        router.push({ path: '/user/set/article', query: { title: title, content: content} })
      },
      quit() {
        sessionStorage.removeItem('token')
        sessionStorage.removeItem("ilevel")
        Toast.success('已退出登录')
        router.replace('/login')
        router.go(-1)
      }
    }
  }
}
</script>