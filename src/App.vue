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
      console.log('qrcodeId=', qrcodeId);
      that.$store.commit('setQrcodeId', qrcodeId)
      await this.$axios.get(this.$store.state.host + this.$store.state.path + '/sk2/mobile/qrcode/getCompanyQrcodeInfo', { params: { qrcodeId: '1547000720000' }}).then(res => {
        console.log('获取二维码信息', res.data);
        if (res.data.status == '100') {
          that.$store.commit('setMchId', res.data.data.mchId)
          that.$store.commit('setQrcodeType', res.data.data.qrcodeType)
        }
      })
      const browserType = this.$utils.browserType();
      const returnUrl = encodeURIComponent(window.location.href);
      // if (browserType == '0') { //微信浏览器
        await this.$axios.get(this.$store.state.host + this.$store.state.path + '/sk2/mobile/authorization/wechat/snsapiBase', { params: { returnUrl: returnUrl }})
      // } else if (browserType == '1') { //支付宝浏览器

      // } else { //其他浏览器

      // }
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
