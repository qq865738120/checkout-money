<template>
  <div class="root">
    <img class="icon" v-lazy="shopIcon"/>
    <p class="title">{{ shopName }}</p>
    <span class="amount">{{ amount }}</span>
    <span class="tip">支付成功</span>
    <div class="jump" v-if="isShow">{{ time }}s <span style="color: #999"> 后自动跳转</span></div>
    <VoucherListItem class="voucher-item" v-for="(item, index) of voucherList" :data="item" :key="index" @use="onVoucherUse"></VoucherListItem>
  </div>
</template>

<script>
import methods from '@/common/methods.js'
import VoucherListItem from '@/components/VoucherListItem'

export default {
  name: 'PaySuccessPage',
  async mounted() {
    this.shopIcon = this.$utils.getParam('shopIcon')
    this.shopName = this.$utils.getParam('shopName')
    this.amount = this.$utils.getParam('payAmount')
    this.$store.commit('setShopName', this.shopName)
    this.$store.commit('setShopIcon', this.shopIcon)
    console.log('shopName', this.$utils.getParam('shopName'));
    await this.$utils.waitTask(this, 'initFag'); //等待初始化任务完成后继续执行下面代码
    this.refVoucherList()
  },
  data () {
    return {
      shopIcon: '',
      shopName: '',
      amount: '',
      time: 8,
      voucherList: [], // isAvailable: 是否可使用, receive: 是否显示立即领取, bgColor: 背景色, amount: 优惠券金额, condition: 优惠券使用条件, shopIcon: 店铺图标, shopName: 店铺名称, vPeriod: 使用期限
      isShow: false //是否展示跳转文字
    }
  },
  components: {
    VoucherListItem
  },
  methods: {

    refVoucherList() {
      let that = this
      this.$vux.loading.show({
       text: '加载中'
      })
      this.$axios.get(this.$store.state.host + this.$store.state.path + '/sk2/cmpy/discount/receiveList', { params: { mchId: that.$store.state.mchId, mainUserId: that.$store.state.mainUserId }}).then(res => {
        console.log('获取可领取优惠券列表', res.data);
        this.voucherList = methods.getVoucherDetail(this, res.data.data, 0, true)
        if (this.voucherList.length == 0) {
          this.time = 3
        } else {
          this.time = 8
        }
        if (this.$store.state.redirecturl != '') {
          this.isShow = true
          let id = setInterval(() => {
            that.time--
          }, 1000);
          setTimeout(() => {
            clearInterval(id);
            window.location.href = this.$store.state.redirecturl
          }, that.time * 1000)
        }
        this.$vux.loading.hide()
      })
    },

    onVoucherUse(id) {
      let that = this
      console.log('领取的优惠券id', id);
      this.$vux.loading.show({
       text: '加载中'
      })
      this.$axios.get(this.$store.state.host + this.$store.state.path + '/sk2/cmpy/discount/receive', { params: { discountId: id, mchId: that.$store.state.mchId, mainUserId: that.$store.state.mainUserId }}).then(res => {
        console.log('用户领取优惠券', res.data);
        if (res.data.status == 100) {
          this.$vux.toast.show({
            text: '领取成功！',
            type: 'success'
          })
          this.refVoucherList()
          this.$vux.loading.hide()
        } else {
          this.$vux.toast.show({
            text: res.data.msg,
            type: 'cancel'
          })
          this.$vux.loading.hide()
        }
        this.refVoucherList()
      })
    }

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
.amount {
  font-size: 50px;
  font-weight: bold;
  margin-bottom: 20px;
}
.amount:before {
  content: "￥";
  font-size: 30px;
  color: $--color-333;
}
.tip {
  font-size: 18px;
  margin-bottom: 44px;
}
.jump {
  font-size: 14px;
  color: $--main-color;
  margin-bottom: 40px;
}
.voucher-item {
  margin-bottom: 10px;
}
</style>
