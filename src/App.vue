<template>
  <div id="app" :style="{ background: $route.meta.bgColor }">
    <transition
      enter-active-class="animated fadeInLeftBig faster"
      leave-active-class="animated fadeOutLeftBig faster">
      <router-view v-wechat-title="$route.meta.title" v-show="$store.state.initFag"/>
    </transition>
    <transition
      enter-active-class="animated fadeInLeftBig faster"
      leave-active-class="animated fadeOutLeftBig faster">
      <div class="com-flex-center loading" v-show="!$store.state.initFag">
        <GridLoader color="#F62135" size="10"></GridLoader>
        <p>loading...</p>
      </div>
    </transition>
  </div>
</template>

<script>
import { GridLoader } from '@saeris/vue-spinners'
import methods from '@/common/methods.js'

export default {
  name: 'App',
  /* 该方法中完成项目的初始化工作 */
  async created() {
    await this.init()
    await methods.appInit(this)
    setTimeout(() => {
      this.$store.commit('setInitFag', true)
    }, 2400)

  },
  components: {
    GridLoader
  },
  methods: {
    async init() {
      const that = this;
      const qrcodeId = this.$utils.getParam('qrcodeId')
      const openId = this.$utils.getParam('openId')
      const aliPayUserId = this.$utils.getParam('aliPayUserId')
      console.log('qrcodeId=', qrcodeId);
      // this.$store.commit('setOpenId', openId)
      that.$store.commit('setQrcodeId', qrcodeId)
      // this.$store.commit('setAliPayUserId', aliPayUserId)

      await this.$axios.get(this.$store.state.host + this.$store.state.path + '/sk2/mobile/qrcode/getCompanyQrcodeInfo', { params: { qrcodeId: qrcodeId }}).then(res => {
        console.log('获取二维码信息', res.data);
        if (res.data.status == '100') {
          that.$store.commit('setMchId', res.data.data.mchId)
          that.$store.commit('setQrcodeType', res.data.data.qrcodeType)
          that.$store.commit('setAmount', res.data.data.moneyStr)
          let url = ''
          if (res.data.data.redirecturl != '') {
            url = res.data.data.redirecturl.indexOf('http') == -1 ? 'http://' + res.data.data.redirecturl : res.data.data.redirecturl
          }
          that.$store.commit('setRedirecturl', url)
        } else {
          this.$router.push({ //不支持的浏览器，跳转到提示页面
            name: 'TipsPage',
            params: {
              iconType: 'warn',
              msg1: '网络异常，请稍后重试。'
            }
          })
        }
      })

      const browserType = this.$utils.browserType();
      const returnUrl = encodeURIComponent(window.location.href);
      if (browserType == '0' && openId == null) { //微信浏览器
        console.log('微信浏览器路线');
        // alert('微信')
        window.location.href = this.$store.state.relHost + '/sk2/mobile/authorization/wechat/snsapiBase?returnUrl=' + returnUrl
      } else if (browserType == '1' && aliPayUserId == null) { //支付宝浏览器
        console.log('支付宝浏览器路线');
        // alert('支付宝')
        window.location.href = this.$store.state.relHost + '/sk2/mobile/authorization/alipay/publicAppAuthorize?returnUrl=' + returnUrl + '&scope=auth_base'
      } else if (openId == null && aliPayUserId == null) { //其他浏览器
        // alert('其他')
        window.location.href = window.location.hash + '&openId=oTeRM1DsyW24Tt-bDXTkDUGOW3T8'
        // window.location.href = window.location.hash + '&aliPayUserId=2088612640305883'
      }
    }
  }
}
</script>

<style>
#app {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}
.loading {
  width: 100%;
  height: calc(100% - 60px);
  position: absolute;
  z-index: 1000;
  flex-direction: column;
}
.loading>p {
  color: #F62135;
}
</style>
