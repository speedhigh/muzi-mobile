<template>
  <div class="pt-12 relative bg-white min-h-screen">
    <muzi-header title="地址批量导入" />
    <div class="px-4 pt-5">
      <div class="text-center">
        <van-uploader
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          :after-read="afterRead"
          class="w-full"
        >
        <div class="w-full border-dashed border-2 border-gray-500 rounded-md pt-5 pb-6 text-center bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 text-gray-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p class="mt-3 text-gray-600 text-sm">点击上传本地文件</p>
        </div>
      </van-uploader>
      </div>
      <!-- 注意事项 -->
      <div class="mt-5 space-y-2.5">
        <div class="flex items-center space-x-2">
          <div class="w-0.5 h-3.5 bg-red-400 rounded" />
          <p class="text-sm font-bold">注意事项</p>
        </div>
        <div class="text-xs leading-5">
          上传文件须为Execl文件格式，文件内必要的内容有：<span class="font-bold">姓名、年龄、身份证号、手机号、邮寄地址</span>。我们将在您提交后进行实时检测，如发现信息缺失则上传失败，需要完善信息后重新上传。
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Uploader, Toast } from 'vant'
import MuziHeader from '/src/components/MuziHeader.vue'
export default {
  components: {
    MuziHeader,
    [Uploader.name]: Uploader
  },
  setup() {
    return {
      afterRead(file) {
        file.status = 'uploading';
        file.message = '上传中...';
        Toast.loading({ message: '上传中...', duration: 0})
      }
    }
  }
}
</script>

<style>
.van-uploader__wrapper {
  display: block;
}
</style>