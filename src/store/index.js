import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

    environment: '', //环境配置，本地为local，线上为online
    host: '', //域名配置
    path: '', //接口路径前缀
    relHost: '', //实际真实域名，该配置会影响对接老项目的url跳转

    appid: 'wxfb8665f40c96d92c',
    initFag: true,

  },
  mutations: {
    setEnvironment(state, value) {
      state.environment = value
    },
    setHost(state, value) {
      state.host = value
    },
    setPath(state, value) {
      state.path = value
    },
    setRelHost(state, value) {
      state.relHost = value
    },
    setAppid(state, value) {
      state.appId = value
    },
    setInitFag(state, value) {
      state.initFag = value
    }
  }
})
