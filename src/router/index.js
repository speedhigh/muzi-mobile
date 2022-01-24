import api from '../api/index.js'
import vip from './vip.js'
import { Toast, Dialog } from 'vant'
import { createRouter, createWebHashHistory } from 'vue-router'
// import { createRouter, createWebHistory } from 'vue-router'
// const routerHistory = createWebHistory();
const router = new createRouter({
	// history: routerHistory,
	history: createWebHashHistory(),
	routes:[
		...vip,
		// ----------主页----------
		{
			path:'/',
			name:'home',
			meta: {
				identity: 'user',
				keepAlive: true //设置页面是否需要使用缓存
			},
			component:() => import('../views/home/index.vue')
		},

		// ----------404----------
		{
			path:'/404',
			component:() => import('../views/404/index.vue')
		},

		// ----------paysuccess----------
		{
			path:'/paysuccess',
			component:() => import('../views/paysuccess/index.vue')
		},

		// ----------分类----------
    {
			path:'/type',
			meta: { identity: 'user' },
			component:() => import('../views/type/index.vue')
		},

		// ---------购物车---------
		{
			path:'/cart',
			meta: { identity: 'user' },
			component:() => import('../views/cart/index.vue')
		},

		// --------完善信息--------
		{
			path:'/info',
			component:() => import('../views/info/index.vue')
		},
		

		// ----------我的----------
		{
			path:'/user',
			meta: { identity: 'user' },
			component:() => import('../views/user/index.vue')
		},
		// --我的 -> 消息--
		{
			path:'/user/msg',
			component:() => import('../views/user/msg.vue')
		},
		// --我的 -> 设置--
		{
			path:'/user/set',
			component:() => import('../views/user/set/index.vue')
		},
		// --我的 -> 设置(售后服务)--
		{
			path:'/user/set/refund',
			component:() => import('../views/user/set/refund.vue')
		},
		// --我的 -> 设置(关于我们)--
		{
			path:'/user/set/about',
			component:() => import('../views/user/set/about.vue')
		},
		// --我的 -> 设置(隐私条款/服务条款)--
		{
			path:'/user/set/article',
			component:() => import('../views/user/set/article.vue')
		},
		// --我的 -> 购物指南--
		{
			path:'/user/guide',
			component:() => import('../views/user/guide/index.vue')
		},
		// --我的 -> 购物指南(详情)--
		{
			path:'/user/guide/dtl',
			component:() => import('../views/user/guide/dtl.vue')
		},
		// --我的 -> 物流配送--
		{
			path:'/user/logistics',
			component:() => import('../views/user/logistics/index.vue')
		},
		// --我的 -> 物流配送(详情)--
		{
			path:'/user/logistics/dtl',
			component:() => import('../views/user/logistics/dtl.vue')
		},

		// --------药品详情--------
		{
			path:'/detail/:id',
			meta: { identity: 'user' },
			component:() => import('../views/detail/index.vue')
		},
		// --药品详情 -> 评论(详情)--
		{
			path:'/detail/comment/:id',
			component:() => import('../views/detail/comment.vue')
		},

		// --------实名认证--------
		{
			path:'/shiming',
			component:() => import('../views/shiming/index.vue')
		},

		// --------收货地址--------
		{
			path:'/address',
			meta: { identity: 'user' },
			component:() => import('../views/address/index.vue')
		},
		// --收货地址 -> 创建/编辑--
		{
			path:'/address/edit',
			name:'addressEdit',
			meta: { identity: 'user' },
			component:() => import('../views/address/edit.vue')
		},

		// --------确认订单--------
		{
			path:'/confirmorder',
			meta: { identity: 'user' },
			component:() => import('../views/confirmorder/index.vue')
		},


		// ----------搜索----------
		{
			path:'/search',
			meta: { identity: 'user' },
			component:() => import('../views/search/index.vue')
		},
		// --搜索 -> 搜索结果--
		{
			path:'/search/list',
			meta: { identity: 'user' },
			component:() => import('../views/search/list.vue'),
			meta: {
				identity: 'user',
				keepAlive: true
			},
		},

		// ----------收藏----------
		{
			path:'/collection',
			component:() => import('../views/collection/index.vue')
		},

		// ---------优惠券---------
		{
			path:'/coupon',
			component:() => import('../views/coupon/index.vue')
		},

		// --------我的订单--------
		{
			path:'/myorder',
			meta: { identity: 'user' },
			component:() => import('../views/myorder/index.vue')
		},
		{
			path:'/myorder/detail',
			meta: { identity: 'user' },
			component:() => import('../views/myorder/detail.vue')
		},

		// ----------评论----------
		{
			path:'/comments/:id',
			component:() => import('../views/comments/index.vue')
		},

		// ----------物流信息----------
		{
			path:'/ship/:id/:img/:sum/:name/:tel/:address/:sdetail',
			name:'ship',
			meta: { identity: 'user' },
			component:() => import('../views/ship/index.vue')
		},

		// 我要成为大客户，我要成为高级经理
		{
			path:'/buyvip',
			meta: { identity: 'user', keepAlive: true },
			component:() => import('../views/buyvip/index.vue')
		},

		// ----------登录----------
		{
			path:'/login',
			component:() => import('../views/login/index.vue')
		},
		// --登录（注册）--
		{
			path:'/login/register',
			component:() => import('../views/login/register.vue')
		},
		// --登录（忘记密码）--
		{
			path:'/login/forgetpwd',
			component:() => import('../views/login/forgetpwd.vue')
		},
		// --登录（修改密码）--
		{
			path:'/login/changepwd',
			component:() => import('../views/login/changepwd.vue')
		}
	]
})

// 路由守卫
router.beforeEach((to,from,next) => {

	// 获取汇率
	if (!window.sessionStorage.getItem("rate")) {
		api.get("/open/home/get_huilv").then((res) => { window.sessionStorage.setItem('rate', res.data.data) })
	}

	// 高级经理
	if(window.localStorage.getItem("buyVip") && window.sessionStorage.getItem("token") && to.path !== '/paysuccess' && window.sessionStorage.getItem("hobby") === 'userlogin') {
		api.get('/newB/isGaoJiJingLi').then((res) => {
			if(res.data.code === 20001 && res.data.msg === '不是高级经理') {
				window.localStorage.removeItem("buyVip")
				return 
			}
			if(res.data.code === 20000 && res.data.msg === '是高级经理') {
				Dialog.alert({message: '您已经是高级经理啦，请重新登录以激活您的高级经理权益'}).then(() => {
					window.localStorage.removeItem("buyVip")
					window.sessionStorage.removeItem('token')
					window.sessionStorage.removeItem("ilevel")
					window.sessionStorage.setItem('loginFrom', '/paysuccess')
					router.replace('/login')
				})
				return
			}
		})
	}

	// login
	let loginBlackRouter = ['/cart', '/user']
	if (loginBlackRouter.includes(to.path) && !window.sessionStorage.getItem("token")) {
		sessionStorage.setItem('infoFrom', to.path)
		sessionStorage.setItem('loginFrom', to.path)
		next('/login')
		return
	}
	if(to.meta.identity === 'vip' && !window.sessionStorage.getItem("token")) {
		Toast('请先登录')
		next('/login')
		return
	}

	// keep-alive
	if(!from.meta.keepAlive) {
		window.scrollTo({ top: 0, behavior: "instant" })
	}

	if(window.sessionStorage.getItem("hobby") === 'newblogin' && to.meta.identity === 'user'){
		next('/vip' + to.fullPath)
		return
	}

	if(window.sessionStorage.getItem("hobby") === 'userlogin' && to.meta.identity === 'vip') {
		Toast.fail('无权访问')
		return
	}

	// 特殊情况
	if(to.path === '/login' && from.path === '/info') { 
		router.go(-1) 
	}
	next()
})

router.afterEach((to, from) => {
	if(window.history.state.back === window.history.state.current) {
		router.go(-1)
	}
})
export default router