<template>
  <section class="relative w-full bg-white rounded-xl flex items-center px-1.5" style="height: 70px; margin-top: -35px">
    <div class="w-full px-2.5 flex items-center justify-between">
      <div class="space-y-1 flex-shrink-0">
        <p class="font-bold text-sm">积分</p>
        <p class="text-xs text-gray-600">积分兑换好礼</p>
      </div>
      <p class="text-xl font-bold truncate">{{ jifen }}</p>
    </div>
    <div class="w-px h-2/5 bg-gray-300" />
    <div class="w-full px-2.5 flex items-center justify-between">
      <div class="space-y-1 flex-shrink-0">
        <p class="font-bold text-sm">余额</p>
        <p class="text-xs text-gray-600">充值更方便</p>
      </div>
      <p class="text-xl font-bold truncate">{{ money }}</p>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    jifen: {
      type: Number,
      default: 0
    },
    money: {
      type: Number,
      default: 0
    }
  }
}
</script>
