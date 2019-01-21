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
        <GridLoader color="#ED7E00" size="10"></GridLoader>
        <p>loading...</p>
      </div>
    </transition>
  </div>
</template>

<script>
import { GridLoader } from '@saeris/vue-spinners'

export default {
  name: 'App',
  /* 该方法中完成项目的初始化工作 */
  async created() {
    await this.init()
    this.$store.commit('setInitFag', true)
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
      this.$store.commit('setOpenId', openId)
      that.$store.commit('setQrcodeId', qrcodeId)
      this.$store.commit('setAliPayUserId', aliPayUserId)

      await this.$axios.get(this.$store.state.host + this.$store.state.path + '/sk2/mobile/qrcode/getCompanyQrcodeInfo', { params: { qrcodeId: '1547000720000' }}).then(res => {
        console.log('获取二维码信息', res.data);
        if (res.data.status == '100') {
          that.$store.commit('setMchId', res.data.data.mchId)
          that.$store.commit('setQrcodeType', res.data.data.qrcodeType)
          that.$store.commit('setAmount', res.data.data.transactionAmountStr)
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
        alert('微信')
        window.location.href = this.$store.state.relHost + '/sk2/mobile/authorization/wechat/snsapiBase?returnUrl=' + returnUrl
      } else if (browserType == '1' && aliPayUserId == null) { //支付宝浏览器
        console.log('支付宝浏览器路线');
        alert('支付宝')
        window.location.href = this.$store.state.relHost + '/sk2/mobile/authorization/alipay/publicAppAuthorize?returnUrl=' + returnUrl + '&scope=auth_base'
      } else if (openId == null && aliPayUserId == null) { //其他浏览器
        alert('其他')
        window.location.href = window.location.hash + '&openId=oTeRM1DsyW24Tt-bDXTkDUGOW3T8'
        // window.location.href = window.location.hash + '&aliPayUserId=2088612640305883'
      }
      if (openId != null || aliPayUserId != null) {
        let para = openId == null ? aliPayUserId : openId
        await this.$axios.get(this.$store.state.host + this.$store.state.path + '/sk2/mobile/userinfo/getMainUserIdByOpenId', { params: { openId: para }}).then(res => {
          console.log('获取用户id', res.data);
          if (res.data.status == '100') {
            that.$store.commit('setMainUserId', res.data.data.mainUserId)
          }
        })
      }

      let cashierCode = ''
      if (openId != null) { //微信支付
        cashierCode = 'WFT-WECHAT'
      } else if (aliPayUserId != null) { //支付宝支付
        cashierCode = 'WFT-AILPAY'
      } else {
        this.$router.push({ //不支持的浏览器，跳转到提示页面
          name: 'TipsPage',
          params: {
            iconType: 'warn',
            msg1: '不支持的浏览器类型。'
          }
        })
      }
      await this.$axios.get(this.$store.state.host + this.$store.state.path + '/sk2/mobile/cashierinfo/getCashierinfo', { params: { cashierCode: cashierCode }}).then(res => {
        console.log('获取收银台列表', res.data);
        if (res.data.status == 100) {
          that.$store.commit('setCashierId', res.data.data.cashierId)
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
  color: #ED7E00;
}
</style>
