<template>
  <div
    v-if="showTopIcon"
    class="fixed h-11 w-11 rounded-full text-gray-200 p-2"
    style="background-color:rgba(0,0,0,0.6)"
    :style="{ bottom: position.bottom, right: position.right }"
    @click="toTop"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11l7-7 7 7M5 19l7-7 7 7" />
    </svg>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref } from 'vue'
export default {
  props: {
    threshold: {
      type: Number,
      default: 1000
    },
    position: {
      type: Object,
      default: () => {
        return {
          bottom: '6rem',
          right: '1rem'
        }
      }
    },
    smooth: {
      type: Boolean,
      default: false
    }
  },
  emits: ['start'],
  setup(props, {emit}) {
    const showTopIcon = ref(false)

    const scrollHandle = function () {
      showTopIcon.value = (window.scrollY > props.threshold)
    }

    // 组件挂载时，添加scroll监听
    onMounted(() => {
      window.addEventListener("scroll", scrollHandle, false);
    })

    // 组件卸载时，停止监听
    onUnmounted(() => {
      window.removeEventListener("scroll", scrollHandle, false);
    })
    return {
      showTopIcon,
      toTop() { 
        window.scrollTo({ 
          top: 0, 
          behavior: props.smooth ? "smooth" : "instant" 
        })
      }
    }
  }
}
</script>

<style>

</style>