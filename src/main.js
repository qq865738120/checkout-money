// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
const config = require('../config').app

import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store' //引入vuex
import axios from 'axios' //引入axios
import Qs from 'qs' //配合axios使用
import 'normalize.css' //浏览器统一样式
import 'animate.css'
import '@/assets/style/common.scss'
import 'lib-flexible/flexible'
import './common/vux-component.js' //vux按需引入组件
import utils from './common/utils.js' //全局引入自定义工具类
import './common/filter.js' //全局定义过滤器
import $ from 'jquery'
import VueLazyload from 'vue-lazyload' //图片懒加载插件
// var wx = require('weixin-js-sdk'); //引入微信js-sdk

Vue.config.productionTip = false

Vue.prototype.$axios = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});
Vue.prototype.$qs = Qs;
Vue.prototype.$utils = utils;
Vue.prototype.$ = $;

Vue.use(VueLazyload, {
  attempt: 1,
  lazyComponent: true,
  error: 'http://q.img.soukong.cn/timg.jpg',
  loading: 'http://q.img.soukong.cn/timg.jpg',
})
Vue.use(require('vue-wechat-title')) //引入动态标题插件

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: `<App v-wechat-title="$store.state.title"/>`,
  created() {
    this.init();
    this.config();
  },
  methods: {
    /* 初始化函数 */
    init() {

    },
    /* 配置 */
    config() {
      const testConfig = {
  environment: 'online', //本地环境配为local，线上环境配为online
  host: 'https://xcx.yc.soukong.cn', //测试环境
  path: '',
  relHost: 'https://xcx.yc.soukong.cn'
}

const proConfig = {
  environment: 'online', //本地环境配为local，线上环境配为online
  host: 'https://sk2.soukong.com', //正式环境
  path: '',
  relHost: 'https://sk2.soukong.com' //实际真实域名，该配置会影响对接老项目的url跳转
}
      this.$store.commit('setHost', config.host)
      this.$store.commit('setPath', config.path)
      this.$store.commit('setEnvironment', config.environment)
      this.$store.commit('setRelHost', config.relHost)
    }
  }
})
