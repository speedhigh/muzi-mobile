export default [
  // --------主页(vip)--------
  {
    path:'/vip',
    name:'vip',
    meta: {
      identity: 'vip',
      keepAlive: true //设置页面是否需要使用缓存
    },
    component:() => import('../views/vip/page/index.vue')
  },
  // --------购物车(vip)--------
  {
    path:'/vip/cart',
    meta: { identity: 'vip' },
    component:() => import('../views/vip/page/cart/index.vue')
  },
  // ----------我的----------
  {
    path:'/vip/user',
    meta: { identity: 'vip' },
    component:() => import('../views/vip/page/user/index.vue')
  },
  // ----------我的(高级经理权益)----------
  {
    path:'/vip/user/rights',
    meta: { identity: 'vip' },
    component:() => import('../views/vip/page/user/rights.vue')
  },
  // --------搜索(vip)--------
  {
    path:'/vip/search',
    meta: { identity: 'vip' },
    component:() => import('../views/vip/page/search/index.vue')
  },
  // --搜索 -> 搜索结果--
  {
    path:'/vip/search/list',
    component:() => import('../views/vip/page/search/list.vue'),
    meta: {
      identity: 'vip',
      keepAlive: true
    },
  },
  // --------药品详情--------
  {
    path:'/vip/detail/:id',
    meta: { identity: 'vip' },
    component:() => import('../views/vip/page/detail/index.vue')
  },

  // --------确认订单--------
  {
    path:'/vip/confirmorder',
    meta: { identity: 'vip' },
    component:() => import('../views/vip/page/confirmorder/index.vue')
  },

  // --------收货地址--------
  {
    path:'/vip/address',
    meta: { identity: 'vip' },
    component:() => import('../views/vip/page/address/index.vue')
  },
  // --收货地址 -> 创建/编辑--
  {
    path:'/vip/address/edit',
    name:'addressEditVip',
    meta: { identity: 'vip' },
    component:() => import('../views/vip/page/address/edit.vue')
  },
  // --------地址批量导入--------
  {
    path:'/vip/address/inducts',
    meta: { identity: 'vip' },
    component:() => import('../views/vip/page/address/inducts.vue')
  },

  // --------我的订单--------
  {
    path:'/vip/myorder',
    meta: { identity: 'vip' },
    component:() => import('../views/vip/page/myorder/index.vue')
  },
  {
    path:'/vip/myorder/detail',
    meta: { identity: 'vip' },
    component:() => import('../views/vip/page/myorder/detail.vue')
  },

  // ----------物流信息----------
  {
    path:'/vip/ship/:id/:img/:sum/:name/:tel/:address/:sdetail',
    name:'shipVip',
    meta: { identity: 'vip' },
    component:() => import('../views/vip/page/ship/index.vue')
  },
  // ---------余额结算---------
  {
    path:'/vip/salary',
    meta: { identity: 'vip' },
    component:() => import('../views/vip/page/salary/index.vue')
  },
  // ---------提现---------
  {
    path:'/vip/salary/withdraw',
    meta: { identity: 'vip' },
    component:() => import('../views/vip/page/salary/withdraw.vue')
  },
  // -------提现记录-------
  {
    path:'/vip/salary/withdraw/record',
    meta: { identity: 'vip' },
    component:() => import('../views/vip/page/salary/record.vue')
  },
]