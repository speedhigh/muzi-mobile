<template>
  <div 
    class="relative pb-12" 
    :class="showTips ? 'h-screen overflow-hidden' : 'min-h-screen'"
  >
    <!-- back-btn -->
    <dtl-header />

    <!-- 轮播图 -->
    <dtl-swipe />

    <!-- main -->
    <main class="space-y-3">
      <!-- info -->
      <section-info @getCount="getCount"/>
      <!-- cmt -->
      <section-cmt :list="commentList" :total="cmtTotal" />
      <!-- more -->
      <section-more />
      <!-- detailImg -->
      <section-dtl />
    </main>

    <!-- footer -->
    <van-action-bar class="pl-2 pr-1 max-w-md mx-auto" style="box-shadow: 0px -1px 0px 0px #E6E6E6;">
      <!-- 购物车 -->
      <router-link to="/cart?from=dtl">
        <van-action-bar-icon icon="cart-o" text="购物车" />
      </router-link>
      <!-- 客服 -->
      <van-action-bar-icon icon="chat-o" text="客服" onclick="openZoosUrl('chatwin')" />
      <component :is="'script'" language="javascript" src="http://dft.zoosnet.net/JS/LsJS.aspx?siteid=DFT78851761&float=1&lng=cn" />
      <!-- 收藏 -->
      <van-action-bar-icon
        :icon="footer.iscollect ? 'star' : 'star-o'"
        :text="footer.iscollect ? '已收藏' : '收藏'"
        :color="footer.iscollect ? '#ff5000':'' "
        @click="collect"
      />
      <van-action-bar-button type="warning" text="加入购物车" :disabled="footer.cartDisabled" @click="addCart" />
      <van-action-bar-button type="danger" text="立即购买" :disabled="footer.buyDisabled" @click="buy" />
    </van-action-bar>

    <!-- 微信浏览器遮罩提示 -->
    <muzi-tips :show-tips="showTips" />
  </div>
</template>

<script>
import { ref, watch, onMounted, reactive } from 'vue'
import api from '/src/api/index.js'
import { Toast, Dialog, ActionBar, ActionBarIcon, ActionBarButton } from 'vant'
import { useRoute, useRouter } from 'vue-router'
import MuziTips from '../../components/MuziTips.vue'
import DtlHeader from './component/DtlHeader.vue'
import DtlSwipe from './component/DtlSwipe.vue'
import SectionInfo from './component/SectionInfo.vue'
import SectionCmt from './component/SectionCmt.vue'
import SectionMore from './component/SectionMore.vue'
import SectionDtl from './component/SectionDtl.vue'
export default {
  components: {
    [ActionBar.name]:ActionBar,
    [ActionBarIcon.name]:ActionBarIcon,
    [ActionBarButton.name]:ActionBarButton,
    MuziTips,
    DtlHeader,
    DtlSwipe,
    SectionInfo,
    SectionCmt,
    SectionMore,
    SectionDtl
  },
  setup() {
    const router = useRouter()
    const route = useRoute()

    // 客服相关
    const LR_username = localStorage.getItem('phone') ? localStorage.getItem('phone') : ''

    // 高级经理分享页相关
    const showTips = ref(false)
    if(route.query.ba59abbe56e057) {
      if(navigator.userAgent.toLowerCase().indexOf('micromessenger') > -1) showTips.value = true
      // sessionStorage.setItem('proid', route.params.id)
    }
    onMounted(() => {
      window.scrollTo(0, 0)
      sessionStorage.removeItem('addressId')
      if (sessionStorage.getItem('token')) {
        api.get('/quan/clearquanstorage', { userid: sessionStorage.getItem('id') })
        api.get("/pay/clearstorage", {userid: sessionStorage.getItem('id'), pid: route.params.id})
      }
    })
    watch(() => route.params, async newParams => {
      if(newParams.id) getComment()
    })
    
    // 检查库存
    const getCount = function(count,collect) {
      footer.buyDisabled = count === 0
      if(!count) Toast.fail('库存为0')
      footer.iscollect = collect
    }
    // 获取评论
    const commentList = ref([])
    const cmtTotal = ref(0)
    const getComment = function() {
      api.get("/open/product_detail/get_productdetail_comment",{ id: route.params.id }).then((res) => {
        cmtTotal.value = res.data.data.length
        commentList.value = res.data.data.length > 2 ? res.data.data.slice(0,2) : res.data.data
      })
    }
    getComment()

    // footer
    const footer = reactive({
      iscollect: false,
      cartDisabled: false,
      buyDisabled: false
    })

    // 登录提示
    const loginDialog = function(type) {
      Dialog.alert({
        message: '您还未登录，请先登录'
      }).then(() => {
        footer.cartDisabled = false
        if(type === 'buy') {
          sessionStorage.setItem('loginFrom', '/confirmorder?from=detail')
          sessionStorage.setItem('infoFrom', '/confirmorder?from=detail')
        }
        if(type === 'cart') {
          sessionStorage.setItem('loginFrom', route.path)
          sessionStorage.setItem('infoFrom', route.path)
        }
        router.push({ path:'/login' })
      });
    }
    
    return {
      back() {
        if(route.query.ba59abbe56e057) { router.replace('/'); return }
        router.go(-1) 
      },
      LR_username,
      getCount,
      showTips,
      commentList,
      cmtTotal,
      footer,
      loginDialog,
      // 收藏、取消收藏
      collect() {
        if (!sessionStorage.getItem('token')) { loginDialog('collect'); return } 
        let data = { userid: sessionStorage.getItem('id'), productid: route.params.id }
        if (!footer.iscollect) {
          api.post("/myfavorite/postCollect", data, true).then((res) => {
            if(res.data.code === 20000) { Toast.success('收藏成功'); footer.iscollect = true }
          })
        } else {
          api.delete("/myfavorite/deleteCollect",data).then((res) => { 
            if(res.data.code === 20000) { Toast.success('取消收藏成功'); footer.iscollect = false }
          })
        }
      },
      // 加入购物车
      addCart() {
        footer.cartDisabled = true
        if(!sessionStorage.getItem('token')) { loginDialog('cart'); return}
        let data = { userid: sessionStorage.getItem('id'), productid: route.params.id } 
        api.post("/cart/post", data, true).then((res) => {
          res.data.code === 20000 ? Toast.success('成功添加') : Toast.fail('加入购物车失败')
          setTimeout(() => { footer.cartDisabled = false }, 500)
        })
      },
      // 立即购买
      buy() {
        footer.buyDisabled = true
        sessionStorage.setItem('drugId', route.params.id)
        if(!sessionStorage.getItem('token')) { loginDialog('buy'); return }
        if(sessionStorage.getItem('shiming') === '0') {
          Dialog.alert({ message: '您还未实名认证，请先完善信息喲~' }).then(() => {
            sessionStorage.setItem('infoFrom', '/confirmorder?from=detail')
            footer.buyDisabled = false
            router.push({ path:'/info' }) 
          })
        } else {
          setTimeout(() => { footer.buyDisabled = false }, 300)
          router.push({ path:'/confirmorder', query: { from: 'detail' } })
        }
      }
    }
  }
}
</script>