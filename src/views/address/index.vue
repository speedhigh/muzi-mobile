<template>
  <div class="relative pt-12 pb-16 min-h-screen">
    <!-- header -->
    <muzi-header title="收货地址" custom-back @back="back" />
    <!-- loading -->
    <van-loading v-show="showLoading" size="32px" vertical class="mt-8"> 加载中，请稍后... </van-loading>
    <!-- list -->
    <van-address-list
      v-show="!showLoading"
      v-model="chosenAddressId"
      :list="list"
      default-tag-text="默认"
      :switchable="switchable"
      @select="onSelect"
      @add="onAdd"
      @edit="onEdit"
    >
      <van-empty v-show="showEmpty" description="地址列表为空" class="mt-12" />
    </van-address-list>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import api from '/src/api/index.js'
import { Toast, Dialog, AddressList,Empty } from 'vant'
import { useRoute, useRouter } from 'vue-router'
import MuziHeader from '/src/components/MuziHeader.vue'
export default {
  components: {
    MuziHeader,
    [AddressList.name]: AddressList,
    [Empty.name]:Empty
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const switchable = ref(!route.query.switchable)
    watch(() => route.query.switchable,(value) => {
      switchable.value = !value
    })
    const showLoading = ref(true)
    const showEmpty = ref(true)
    const list = ref([]) 
    const chosenAddressId = ref(sessionStorage.getItem('addressId') ? +sessionStorage.getItem('addressId') : null);
    api.get("useraddress/getList",{ userid: sessionStorage.getItem('id') }).then((res) => {
      if(res.data.code === 20000 && res.data.data.length > 0) {
        showEmpty.value = false
        list.value = res.data.data
        let chosenId = res.data.data.find(item => item.isDefault === true).id
        if(!sessionStorage.getItem('addressId')) chosenAddressId.value = chosenId
      }
      showLoading.value = false
    })
    const onAdd = () => {
      router.push({ path: '/address/edit', query: { operation: 'creat', from: route.fullPath, addressLength: list.value.length } })
    }
    const onEdit = (item) => {
      router.push({ path: '/address/edit', query: { operation: 'edit', from: route.fullPath, addressId: item.id, addressLength: list.value.length } })
    }
    const onSelect = (item) => {
      chosenAddressId.value = item.id
      sessionStorage.setItem('addressId',item.id)
      Toast.success('选择成功')
      router.replace('/confirmorder?from='+route.query.from)
    }
    return {
      switchable,
      showLoading,
      showEmpty,
      chosenAddressId,
      list,
      back() {
        if(!chosenAddressId.value && switchable.value) {
          Dialog.alert({ message: '请选择一个收货地址' })
        } else {
          router.go(-1)
        }
      },
      onAdd,
      onEdit,
      onSelect,
    }
  }
}
</script>