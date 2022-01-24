import { createApp } from 'vue'
import App from './App.vue'
import router from "./router/index.js"
import './index.css'
import 'vant/lib/index.css'
import 'default-passive-events'

const app = createApp(App)


// 全局组件
import BaseSquare from './components/global/BaseSquare.vue'
import BasePagination from './components/global/BasePagination.vue'
import BaseTotop from './components/global/BaseTotop.vue'

app.component('BaseSquare', BaseSquare)
app.component('BasePagination', BasePagination)
app.component('BaseTotop', BaseTotop)


// vant插件
import {
  Icon,
  Button,
  Dialog,
  Image as VanImage,
  Lazyload,
  Sticky,
  Loading,
  Field,
  SubmitBar,
  CouponList,
  Tab, 
  Tabs,
  Form,
  CellGroup,
} from 'vant'

app
  .use(router)
  .use(Icon)
  .use(Button)
  .use(Dialog)
  .use(VanImage)
  .use(Lazyload)
  .use(Sticky)
  .use(Loading)
  .use(Field)
  .use(SubmitBar)
  .use(CouponList)
  .use(Tab)
  .use(Tabs)
  .use(Form)
  .use(CellGroup)
  .mount("#app");