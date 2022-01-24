<template>
  <header class="fixed top-0 z-50 p-4" @click="back">
    <div class="w-8 h-8 rounded-full flex items-center justify-center bg-[rgba(0,0,0,0.6)]">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </div>
  </header>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
export default {
  setup() {
    const router = useRouter()
    const route = useRoute()
    return {
      back() {
        if(route.query.ba59abbe56e057) { router.replace('/'); return }
        router.go(-1) 
      }
    }
  }
}
</script>