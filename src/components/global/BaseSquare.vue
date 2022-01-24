<template>
  <div class="w-full relative" :style="{'paddingTop':ar+'%'}">
    <div class="absolute inset-0">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    ar: {
      type: String,
      default: '100'
    }
  }
}
</script>