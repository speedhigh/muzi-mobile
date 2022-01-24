<template>
  <header class="fixed top-0 max-w-md w-full h-12 bg-red-400 z-50 flex items-center px-4 pt-3">
    <!-- logo -->
    <van-image :src="logoImg" width="82" height="30" alt="logo" class="flex-shrink-0 mr-3" />
    <!-- search -->
    <div class="flex-grow h-[1.88rem] bg-white rounded-2xl flex items-center px-3" @click="search">
      <p class="text-[0.79rem] text-gray-600">搜索药品、品牌</p>
      <svg xmlns="http://www.w3.org/2000/svg" class="ml-auto h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    <!-- notice -->
    <router-link to="/user/msg" class="ml-3 mr-2 mt-1">
      <van-image :src="noticeImg" width="19" height="22" fit="cover" alt="noticeImg" class="flex-shrink-0" />
    </router-link>
    <!-- cs -->
    <van-image :src="csImg" width="20" height="20" fit="cover" alt="csImg" class="flex-shrink-0 mx-2 -mt-0.5" onclick="openZoosUrl('chatwin')"/>
    <component :is="'script'" language="javascript" src="http://dft.zoosnet.net/JS/LsJS.aspx?siteid=DFT78851761&float=1&lng=cn" />
  </header>
</template>

<script>
import { useRouter } from 'vue-router'
import logoImg from '/src/assets/images/header_logo.webp'
import noticeImg from '/src/assets/images/user/notice.webp'
import csImg from '/src/assets/images/user/cs.webp'
export default {
  setup() {
    const router = useRouter()
    const LR_username = localStorage.getItem('phone') ? localStorage.getItem('phone') : ''
    return {
      logoImg,
      noticeImg,
      csImg,
      LR_username,
      search() {
        sessionStorage.setItem('searchFrom', '/')
        router.push({ path:'/search' })
      },
    }
  }
}
</script>