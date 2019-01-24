import Vue from 'vue'
import Router from 'vue-router'
// import Home from '@/components/Home'
// import RedPacketPage from '@/components/RedPacketPage'
// import PaySuccessPage from '@/components/PaySuccessPage'
// import PayFailPage from '@/components/PayFailPage'

const Home = () => import('@/components/Home')
const PaySuccessPage = () => import('@/components/PaySuccessPage')
const PayFailPage = () => import('@/components/PayFailPage')
const TipsPage = () => import('@/components/TipsPage')

Vue.use(Router)

export default new Router({
  routes: [
    { // 主页
      path: '/',
      name: 'Home',
      meta: {
        title: '钱多来收银台',
        bgColor: '#f5f5f5'
      },
      component: Home
    },
    { // 主页
      path: '/pay/success',
      name: 'PaySuccessPage',
      meta: {
        title: '钱多来收银台',
        bgColor: '#ffffff'
      },
      component: PaySuccessPage
    },
    { // 主页
      path: '/tips',
      name: 'TipsPage',
      meta: {
        title: '提示',
        bgColor: '#ffffff'
      },
      component: TipsPage
    },
    { // 主页
      path: '/pay/fail',
      name: 'PayFailPage',
      meta: {
        title: '支付失败',
        bgColor: '#ffffff'
      },
      component: PayFailPage
    },
  ]
})
