<template>
  <div class="root">
    <img class="icon" v-lazy="shopIcon"/>
    <p class="title">{{ shopName }}</p>
    <div class="com-flex-center card">
      <span>￥</span>
      <input v-model="inputAmount" type="number" class="open-input" :style="{width: inputWidth}" v-if="$store.state.qrcodeType == '1'" :placeholder="placeholder" @blur="onInputBlur" @keyup="onInputChange"/>
      <span v-if="$store.state.qrcodeType == '2'">{{ $store.state.amount }}</span>
    </div>
    <div class="card" style="margin-top: 1px">
      <div class="voucher com-flex-between">
        <span class="voucher-right iconfont icon-youhuiquan">优惠券</span>
        <div class="com-flex-between" v-if="state == 'selectVoucher'" @click="onSelectVoucherClick">
          <div class="voucher-tag">{{ voucherTag }}</div>
          <span class="iconfont icon-jiantou" style="font-size: 13px">-￥{{ voucherAmount }}</span>
        </div>
        <span v-if="state == 'haveVoucher'" class="iconfont icon-jiantou color-999" style="font-size: 13px" @click="onSelectVoucherClick">使用优惠券</span>
        <span v-if="state == 'noVoucher'" class="color-999" style="font-size: 13px">暂无优惠券</span>
      </div>
      <div class="voucher com-flex-between">
        <span class="voucher-right iconfont icon-purse">实付款</span>
        <span class="amount">￥{{ amount }}</span>
      </div>
    </div>
    <div class="pay-btn" @click="onPay">开始付款</div>
    <!-- <p class="offer">使用优惠码</p> -->
    <Popup v-model="isShowPopup" height="50%" style="border-radius: 15px 15px 0 0;">
      <div class="popup-select-voucher com-flex-col-center">
        <p>优惠券</p>
        <VoucherListItem class="voucher-item" v-for="(item, index) of voucherList" :data="item" :key="index" @use="onVoucherUse"></VoucherListItem>
      </div>
    </Popup>
  </div>
</template>

<script>
import methods from '@/common/methods.js'
import VoucherListItem from '@/components/VoucherListItem'
let fontSize = '37.5';
let voucherList = []; //优惠券列表接口返回数据，将在页面初始化时调用接口获取
let detailId = '' // 使用的优惠券详细id

export default {
  name: 'Home',
  async mounted() {
    fontSize = parseInt(this.$('html').css('font-size').replace('px', ''));
    await this.$utils.waitTask(this, 'initFag'); //等待初始化任务完成后继续执行下面代码
    if (!this.$store.state.mainUserId) {
      await this.appInit()
    }
    this.init()
  },
  data () {
    return {
      shopIcon: '',
      shopName: '',
      inputWidth: 168 / fontSize + 'rem',
      placeholder: '请输入付款金额',
      inputAmount: '',
      state: 'noVoucher', // selectVoucher: 选中了优惠券  haveVoucher：有可选优惠券  noVoucher: 没有可使用的优惠券
      voucherAmount: 0,
      amount: 0,
      isShowPopup: false,
      voucherList: [ // isAvailable: 是否可使用, receive: 是否显示立即领取, bgColor: 背景色, amount: 优惠券金额, condition: 优惠券使用条件, shopIcon: 店铺图标, shopName: 店铺名称, vPeriod: 使用期限
      ],
      voucherTag: '' //优惠券类型
    }
  },
  components: {
    VoucherListItem
  },
  methods: {

    async appInit() {
      await methods.appInit(this)
    },

    init() {
      let that = this
      this.amount = this.$store.state.amount
      this.$axios.get(this.$store.state.host + this.$store.state.path + '/sk2/mobile/company/getCmpyInfo', { params: { mchId: that.$store.state.mchId }}).then(res => {
        console.log('获取商户信息', res.data);
        if (res.data.status == '100') {
          that.shopIcon = res.data.data.logoUrl;
          that.$store.commit('setShopIcon', res.data.data.logoUrl)
          that.shopName = res.data.data.simpCmpyName;
          that.$store.commit('setShopName', res.data.data.simpCmpyName)
        }
      })
      this.flushList()
    },

    flushList() {
      let that = this;
      let parm = {
        mchId: that.$store.state.mchId,
        mainUserId: that.$store.state.mainUserId
      }
      this.$axios.get(this.$store.state.host + this.$store.state.path + '/sk2/cmpy/discount/userDiscounts', { params: parm}).then(res => {
        console.log('获取优惠券列表', res.data);
        this.$vux.loading.hide()
        if (res.data.status == 100) {
          let data = res.data.data
          if (data.length == 0) { //没有优惠券
            this.state = 'noVoucher'
          } else { //有优惠券
            this.state = 'noVoucher'
            for (let item of data) {
              if (item.endStatus == 0 && item.useStatus == 0) {
                this.state = 'haveVoucher'
              }
            }
            voucherList = data;
          }
        }
      })
    },

    onInputChange() { //金额输入框数值改变触发
      this.placeholder = ''
      this.inputWidth = (30 + (this.inputAmount.length - 1) * 14) / fontSize + 'rem'
    },

    onInputBlur() { //金额输入框失去焦点
      this.$store.commit('setAmount', this.inputAmount)
      if (this.inputAmount == '') {
        this.placeholder = '请输入付款金额'
        this.inputWidth = 168 / fontSize + 'rem'
      } else {
        this.inputAmount = this.$utils.formateMoney(this.inputAmount);
        this.onInputChange()
        this.amount = this.inputAmount
      }
    },

    async onSelectVoucherClick() { //点击选择优惠券
      if (this.$store.state.qrcodeType == 1) { //自助输入付款金额
        if (this.inputAmount == '' || this.inputAmount == 0) {
          this.$vux.toast.show({
            text: '还没有输入付款金额哦！',
            type: 'text'
          })
          return;
        }
      }
      this.$vux.loading.show({
        text: '加载中'
      })
      this.flushList()
      this.voucherList = methods.getVoucherDetail(this, voucherList, this.inputAmount, false)
      this.isShowPopup = true
    },

    onVoucherUse(id) { //使用优惠券
      detailId = id
      this.isShowPopup = false;
      this.state = 'selectVoucher'
      console.log('选择的优惠券id', id);
      for (let item of this.voucherList) {
        if (item.id == id) {
          this.voucherTag = item.voucherType
          if (item.voucherType == '折扣券') {
            this.amount = (parseFloat(this.inputAmount) * item.amount / 10).toFixed(2);
            this.voucherAmount = (parseFloat(this.inputAmount) - this.amount).toFixed(2)
          } else if (item.voucherType == '代金券') {
            this.amount = (parseFloat(this.inputAmount) - item.amount).toFixed(2)
            this.voucherAmount = item.amount
          }
        }
      }
    },

    async onPay() { //支付按钮点击事件
      let that = this;
      this.$store.commit('setPayAmount', this.amount)
      this.$vux.loading.show({
       text: '加载中'
      })
      let par = {
        userOpenValue: '', //Y		用户标识，微信openid或者支付宝userid
        payAmount: that.inputAmount,	//Y		付款金额（原价，非优惠后金额）
        qrcodeId: that.$store.state.qrcodeId,	//Y		二维码id
        buyClient: 2,	//Y		下单终端 1-app 2-H5 3-PC 4-小程序 5-门店收银
        buyPlatform: '',	//Y		下单平台 1-微信 2-支付宝 3-搜空云
        buyPage: 4,	//Y		下单页面 1-详情也 2-店铺购物车 3-平台购物车 4-扫码页面
      }
      if (this.$store.state.openId != null) {
        par.userOpenValue = this.$store.state.openId
        par.buyPlatform = 1
      } else if (this.$store.state.aliPayUserId != null) {
        par.userOpenValue = this.$store.state.aliPayUserId
        par.buyPlatform = 2
      }
      if (detailId != '') { //如果使用了优惠券则传优惠券id
        par.discountDetailId = detailId
      }
      let res = ''
      if (!this.$store.state.orderNo) { //如果没有orderNo则调用接口获取
        res = await this.$axios.get(this.$store.state.host + this.$store.state.path + '/sk2/mobile/order/submitScanOrder', { params: par})
      }
      console.log('提交收款码订单', res.data);
      if ((res.data && res.data.status == 100) || res == '') {
        if (this.$store.state.openId != null) { //调用微信支付
          let data = {
            channelId: that.$store.state.cashierId,	//Y		支付通道id
            orderID: res == '' ? this.$store.state.orderNo : res.data.data.orderNo,	//Y		订单编号
            openId: that.$store.state.openId,	//Y		微信openId
            isMinipg: 0	//Y		1-小程序支付 0-js支付
          }
          this.$axios.post(this.$store.state.host + this.$store.state.path + '/sk2/mobile/pay/wftWechatPay', that.$qs.stringify(data)).then(res => {
            console.log('微信支付', res.data);
            if (res.data.status == 100) {
              this.$vux.loading.hide()
              this.$store.commit('setAppid', res.data.data.dataMap.appId)
              let successUrl = escape(window.location.href.split("?")[0] + 'pay/success?' + window.location.href.split('?')[1] + `&shopIcon=${that.$store.state.shopIcon}&shopName=${that.$store.state.shopName}&payAmount=${that.$store.state.payAmount}`)
              let failUrl = escape(window.location.href.split("?")[0] + 'pay/fail?' + window.location.href.split('?')[1])
              let parm = `openId=${this.$store.state.openId}&appId=${res.data.data.dataMap.appId}&timeStamp=${res.data.data.dataMap.timeStamp}&nonceStr=${res.data.data.dataMap.nonceStr}&packages=${res.data.data.dataMap.packages}&signType=${res.data.data.dataMap.signType}&paySign=${res.data.data.dataMap.sign}&successUrl=${successUrl}&failUrl=${failUrl}`
              console.log('par', parm);
              console.log('successUrl',successUrl);
              window.location.href = this.$store.state.relHost + '/sk2/page/pay/wft/wechat.html?' + parm
            } else {
              this.$vux.loading.hide()
              this.$router.push({ //跳转到支付失败页面
                name: 'TipsPage',
                params: {
                  iconType: 'warn',
                  msg1: '二维码已失效'
                }
              })
            }
          })
        } else if (this.$store.state.aliPayUserId != null) { //调用支付宝支付
          let data = {
            channelId: that.$store.state.cashierId,	//Y		支付通道id
            buyerId: that.$store.state.aliPayUserId,	//Y		支付宝用户id（付款方）
            orderID: res == '' ? this.$store.state.orderNo : res.data.data.orderNo,	//Y		订单编号
          }
          this.$axios.post(this.$store.state.host + this.$store.state.path + '/sk2/mobile/pay/wftAliPay', that.$qs.stringify(data)).then(res => {
            console.log('支付宝支付', res.data);
            if (res.data.status == 100) {
              this.$vux.loading.hide()
              let successUrl = escape(window.location.href.split("?")[0] + 'pay/success?' + window.location.href.split('?')[1] + `&shopIcon=${that.$store.state.shopIcon}&shopName=${that.$store.state.shopName}&payAmount=${that.$store.state.payAmount}`)
              let failUrl = escape(window.location.href.split("?")[0] + 'pay/fail?' + window.location.href.split('?')[1])
              let parm = `tradeNO=${res.data.data.dataMap.tradeNO}&successUrl=${successUrl}&failUrl=${failUrl}`
              window.location.href = this.$store.state.relHost + '/sk2/page/pay/wft/alipay.html?' + parm
            } else {
              this.$vux.loading.hide()
              this.$router.push({ //跳转到支付失败页面
                name: 'TipsPage',
                params: {
                  iconType: 'warn',
                  msg1: '支付失败'
                }
              })
            }
          })
        }
      } else {
        this.$vux.loading.hide()
        this.$vux.toast.show({
          text: res.data.msg,
          type: 'text'
        })
      }
    },

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '@/assets/style/common.scss';

.root {
  display: flex;
  align-items: center;
  flex-direction: column;
}
.icon {
  width: 80px;
  height: 80px;
  border-radius: 100%;
  margin-top: 50px;
}
.title {
  font-size: 15px;
  color: $--color-333;
}
.card {
  border-radius: 10px;
  background-color: white;
  width: 305px;
  padding: 26px 20px;
  margin-top: 10px;
  font-size: 24px;
}
// .open-input {
//
// }
.voucher {
  font-size: 13px;
  color: $--main-color;
}
.voucher-tag {
  border: 1px solid $--main-color;
  padding: 2px;
  border-radius: 4px;
  margin-right: 4px;
}
.icon-jiantou::after {
  color: $--color-95;
  margin-left: 3px;
}
.icon-youhuiquan {
  font-size: 18px;
  color: $--color-333;
}
.icon-youhuiquan::before {
  color: $--main-color;
  margin-right: 6px;
}
.icon-purse {
  font-size: 18px;
  color: $--color-333;
}
.icon-purse::before {
  color: $--main-color;
  margin-right: 6px;
}
.card>div:last-child {
  margin-top: 34px;
}
.amount {
  font-size: 16px;
  font-weight: bold;
  margin-right: 3px;
}
.pay-btn {
  padding: 16px 32px;
  color: white;
  background-color: $--main-color;
  border-radius: 30px;
  font-size: 17px;
  box-shadow:0px 2px 29px 0px rgba(255,154,163,1);
  margin-top: 80px;
}
.offer {
  font-size: 14px;
  color: $--color-666;
  margin-top: 20px;
}
.color-999 {
  color: $--color-999;
}
.popup-select-voucher>p:first-child {
  font-size: 16px;
  color: $--color-333;
  font-weight:bold;
  margin-top: 40px;
  margin-bottom: 30px;
}
.voucher-item {
  margin-bottom: 10px;
}
</style>
