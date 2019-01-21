<template>
  <div class="root">
    <img class="icon" v-lazy="$store.state.shopIcon"/>
    <p class="title">{{ $store.state.shopName }}</p>
    <span class="amount">{{ $store.state.payAmount }}</span>
    <span class="tip">支付成功</span>
    <div>{{ time }}s <span style="color: #999"> 后自动跳转</span></div>
    <VoucherListItem class="voucher-item" v-for="(item, index) of voucherList" :data="item" :key="index" @use="onVoucherUse"></VoucherListItem>
  </div>
</template>

<script>
import methods from '@/common/methods.js'
import VoucherListItem from '@/components/VoucherListItem'

export default {
  name: 'PaySuccessPage',
  mounted() {
    let that = this
    this.$axios.get(this.$store.state.host + this.$store.state.path + '/sk2/cmpy/discount/receiveList', { params: { mchId: that.$store.state.mchId, mainUserId: that.$store.state.mainUserId }}).then(res => {
      console.log('获取可领取优惠券列表', res.data);
      this.voucherList = methods.getVoucherDetail(this, res.data.data, 0, false)
    })
  },
  data () {
    return {
      shopIcon: 'http://www.yougexing.net/uploads/180625/1-1P625150924-50.jpg',
      shopName: '搜空生活小店',
      amount: '198',
      time: 3,
      voucherList: [] // isAvailable: 是否可使用, receive: 是否显示立即领取, bgColor: 背景色, amount: 优惠券金额, condition: 优惠券使用条件, shopIcon: 店铺图标, shopName: 店铺名称, vPeriod: 使用期限
    }
  },
  components: {
    VoucherListItem
  },
  methods: {
    onVoucherUse(id) {

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
.root>div:first-of-type {
  font-size: 14px;
  color: $--main-color;
  margin-bottom: 40px;
}
.voucher-item {
  margin-bottom: 10px;
}
</style>
