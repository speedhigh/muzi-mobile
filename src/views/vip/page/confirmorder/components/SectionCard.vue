<template>
  <section v-for="(item, index) in list" :key="index" class="p-4 bg-white rounded-2xl">
    <p class="text-sm">{{ item.storename }}</p>
    <div class="mt-4 space-y-4">
      <div v-for="(card, idx) in item.productMain" :key="idx">
        <div class="flex items-stretch">
          <van-image
            width="100"
            height="100"
            :src="card.simage1"
            radius="5"
            lazy-load
            class="flex-shrink-0"
          >
            <template #loading>
              <van-loading type="spinner" size="20" />
            </template>
          </van-image>
          <div class="ml-2.5">
            <p class="h-10 line-2 text-sm"> {{ card.stitle }} </p>
            <p class="mt-1 text-red-400 text-lg leading-5"> 
              <span>{{ card.productMaintbl.iscommon ? card.productMaintbl.iprice : card.productMaintbl.svipprice }}</span>
              <span class="text-xs ml-0.5">港币</span>
              <span class="text-xs ml-0.5 text-gray-500">约{{ card.productMaintbl.iscommon ? Math.round(card.productMaintbl.iprice * rate * 10) / 10 : Math.round(card.productMaintbl.svipprice * rate * 10) / 10}}元</span>
            </p>
            <van-stepper
              v-model="card.icount"
              button-size="25"
              max="999"
              class="mt-2"
              :before-change="beforeChange"
              @change="changeStepper(card.id, card.icount)"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import api from '/src/api/index.js'
import { useRoute } from 'vue-router'
import { Toast, Stepper } from 'vant'

export default {
  components: {
    [Stepper.name]:Stepper,
  },
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const route = useRoute()
    const rate = +sessionStorage.getItem('rate')
    return {
      rate,
      beforeChange() {
        Toast.loading({ message: '修改中', forbidClick: true });
        return new Promise((resolve) => {
          setTimeout(() => {
            Toast.clear();
            resolve(true);
          }, 300);
        });
      },
      changeStepper(id, count) {
        if (route.query.from === 'cart') {
          api.put("/newB/updateCartNum",{ cartid: id, count:count })
        } else {
          api.get("/pay/buynowchange",{
            userid: sessionStorage.getItem('id'),
            pid: sessionStorage.getItem('drugId'),
            count: count
          })
        }
      }
    }
  }
}
</script>