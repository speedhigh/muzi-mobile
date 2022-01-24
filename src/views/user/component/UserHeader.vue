<template>
  <header class="bg-red-400 h-12 px-4 py-2 flex items-center z-50">
    <p class="text-lg text-white">我的</p>
    <div class="ml-auto flex items-center space-x-4">
      <!-- 消息 -->
      <router-link to="/user/msg">
        <van-image
          :src="noticeImg"
          width="19"
          height="22"
          lazy-load
          fit="cover"
          alt="消息"
          class="flex-shrink-0"
        />
      </router-link>
      <!-- 客服 -->
      <van-image 
        :src="csImg" 
        width="20" 
        height="20" 
        lazy-load 
        fit="cover"
        alt="客服"
        class="flex-shrink-0 -mt-1" 
        onclick="openZoosUrl('chatwin')"
      />
      <!-- <div v-is="'script'" language="javascript" src="http://dft.zoosnet.net/JS/LsJS.aspx?siteid=DFT78851761&float=1&lng=cn"></div> -->
      <component :is="'script'" language="javascript" src="http://dft.zoosnet.net/JS/LsJS.aspx?siteid=DFT78851761&float=1&lng=cn" />
      <!-- 设置 -->
      <router-link to="/user/set">
        <van-image
          :src="setImg"
          width="22"
          height="20"
          lazy-load
          fit="cover"
          alt="设置"
          class="flex-shrink-0"
        />
      </router-link>
    </div>
  </header>
</template>
<script>
import noticeImg from '/src/assets/images/user/notice.webp'
import csImg from '/src/assets/images/user/cs.webp'
import setImg from '/src/assets/images/user/set.webp'
export default {
  setup() {
    return {
      noticeImg,
      csImg,
      setImg,
    }
  }
}
</script>
