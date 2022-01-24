<template>
  <header 
    class="fixed top-0 max-w-md w-full h-12 z-50 shadow-b"
    :class="dark ? 'bg-gray-900 text-white' : 'bg-white'"
  >
    <div class="w-full h-full flex items-center px-4 py-2 relative z-20">
      <!-- back -->
      <div class="absolute left-0 flex items-center px-4" @click="back">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </div>
      <!-- title -->
      <div v-if="title" class="absolute flex items-center" style="left:50%; top:50%; transform: translate(-50%, -50%);">
        <p class="text-lg flex-shrink-0">
          {{ title }}
        </p>
      </div>
      <!-- right -->
      <slot />
    </div>
  </header>
</template>

<script>
import { useRouter, useRoute } from 'vue-router'
export default {
  props: {
    title: {
      type: String,
      default:''
    },
    customBack: {
      type: Boolean,
      default: false
    },
    dark: {
      type: Boolean,
      default: false
    }
  },
  emits: ['back'],
  setup(props,{ emit }) {
    const router = useRouter()
    const path = useRoute().path
    return {
      path,
      back() { props.customBack ? emit('back') : router.go(-1) }
    }
  }
}
</script>
