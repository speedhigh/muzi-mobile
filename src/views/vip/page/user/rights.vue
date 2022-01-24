<template>
  <div class="relative pt-12 bg-gray-900 min-h-screen">
    <muzi-header title="权益说明" :dark="true" />
    <img :src="rightsImg" alt="权益说明" class="w-full h-full">
  </div>
</template>

<script>
import MuziHeader from '/src/components/MuziHeader.vue'
import rightsImg from '/src/assets/images/vip/rightsImg.webp'
export default {
  components: {
    MuziHeader
  },
  setup() {
    return {
      rightsImg
    }
  }
}
</script>

<style>

</style>