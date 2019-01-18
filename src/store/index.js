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
    initFag: false,
    mchId: '', // 商户id
    qrcodeId: '', //二维码id
    qrcodeType: '', //二维码类型 1-自助收款码 2-指定金额收款码
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
    },
    setMchId(state, value) {
      state.mchId = value
    },
    setQrcodeId(state, value) {
      state.qrcodeId = value
    },
    setQrcodeType(state, value) {
      state.qrcodeType = value
    }
  }
})
