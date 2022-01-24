<template>
  <div class="w-full rounded-md">
    <base-square>
      <van-image width="100%" height="100%" :src="msg.simage1" lazy-load :alt="msg.stitle">
        <template #loading>
          <van-loading type="spinner" size="20" />
        </template>
      </van-image>
    </base-square>
    <div class="w-full bg-white px-2.5 pt-2 pb-3 rounded-b-md space-y-0.5">
      <div v-html="msg.stitle" class="h-9 text-sm line-2 leading-tight" />
      <p class="text-red-400 text-lg">
        {{ msg.iprice }}<span class="text-xs ml-0.5">港币</span>
        <span class="text-xs text-gray-500 ml-0.5">约{{ Math.round(msg.iprice * rate * 10) / 10 }}元</span>
      </p>
      <div class="flex items-center justify-between text-gray-600 text-xs">
        <p>{{ msg.country }}</p>
        <p>已售{{ msg.icountsale }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    msg: {
      type: Object,
      default:() => {},
      resquired: true
    }
  },
  setup() {
    const rate = +sessionStorage.getItem('rate')
    return {
      rate
    }
  }
}
</script>

<style>
  .van-image__img {
    border-top-left-radius: 7px;
    border-top-right-radius: 7px;
  }
</style>