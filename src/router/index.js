import Vue from 'vue'
import Router from 'vue-router'
// import Home from '@/components/Home'
// import RedPacketPage from '@/components/RedPacketPage'
// import PaySuccessPage from '@/components/PaySuccessPage'
// import PayFailPage from '@/components/PayFailPage'

const Home = () => import('@/components/Home')

Vue.use(Router)

export default new Router({
  routes: [
    { // 主页
      path: '/',
      name: 'Home',
      meta: {
        title: '首页'
      },
      component: Home
    },
  ]
})
