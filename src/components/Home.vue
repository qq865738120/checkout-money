<template>
  <div class="root">
    <img class="icon" v-lazy="shopIcon"/>
    <p class="title">{{ shopName }}</p>
    <div class="com-flex-center card">
      <span>￥</span><input class="open-input" placeholder="请输入付款金额" />
    </div>
    <div class="card" style="margin-top: 1px">
      <div class="voucher com-flex-between">
        <span class="voucher-right iconfont icon-youhuiquan">优惠券</span>
        <div class="com-flex-between" v-if="state == 'selectVoucher'">
          <div class="voucher-tag">满减券</div>
          <span class="iconfont icon-jiantou" style="font-size: 13px">-￥{{ amount }}</span>
        </div>
        <span v-if="state == 'haveVoucher'" class="iconfont icon-jiantou color-999" style="font-size: 13px" @click="isShowPopup = true">使用优惠券</span>
        <span v-if="state == 'noVoucher'" class="color-999" style="font-size: 13px">暂无优惠券</span>
      </div>
      <div class="voucher com-flex-between">
        <span class="voucher-right iconfont icon-youhuiquan">优惠券</span>
        <span class="amount">￥{{ amount }}</span>
      </div>
    </div>
    <div class="pay-btn">开始付款</div>
    <p class="offer">使用优惠码</p>
    <Popup v-model="isShowPopup" height="40%">
      <div class="popup-select-voucher com-flex-col-center">
        <p>优惠券</p>
        <VoucherListItem class="voucher-item" v-for="(item, index) of voucherList" :data="item" :key="index"></VoucherListItem>
      </div>
    </Popup>
  </div>
</template>

<script>
import methods from '@/common/home.js'
import VoucherListItem from '@/components/VoucherListItem'

export default {
  name: 'Home',
  created() {

  },
  mounted() {

  },
  data () {
    return {
      shopIcon: 'http://www.yougexing.net/uploads/180625/1-1P625150924-50.jpg',
      shopName: '店铺名称',
      state: 'haveVoucher', // selectVoucher: 选中了优惠券  haveVoucher：有可选优惠券  noVoucher: 没有可使用的优惠券
      voucherAmount: 10.00,
      amount: 188.00,
      isShowPopup: false,
      voucherList: [ // isAvailable: 是否可使用, receive: 是否显示立即领取, bgColor: 背景色, amount: 优惠券金额, condition: 优惠券使用条件, shopIcon: 店铺图标, shopName: 店铺名称, vPeriod: 使用期限
        { isAvailable: false, receive: true, bgColor: '#fcf4f2', amount: 10, condition: '满199可用', shopIcon: 'http://www.yougexing.net/uploads/180625/1-1P625150924-50.jpg', shopName: '美美的夏夏小店', vPeriod: '2018.12.14-2018.12.31', voucherType: '代金券', voucherCount: '3' },
        { isAvailable: true, receive: true, bgColor: '#fcf4f2', amount: 10, condition: '满199可用', shopIcon: 'http://www.yougexing.net/uploads/180625/1-1P625150924-50.jpg', shopName: '美美的夏夏小店', vPeriod: '2018.12.14-2018.12.31', voucherType: '代金券', voucherCount: '3' },
        { isAvailable: false, receive: true, bgColor: '#fcf4f2', amount: 10, condition: '满199可用', shopIcon: 'http://www.yougexing.net/uploads/180625/1-1P625150924-50.jpg', shopName: '美美的夏夏小店', vPeriod: '2018.12.14-2018.12.31', voucherType: '代金券', voucherCount: '3' },
        { isAvailable: true, receive: true, bgColor: '#fcf4f2', amount: 10, condition: '满199可用', shopIcon: 'http://www.yougexing.net/uploads/180625/1-1P625150924-50.jpg', shopName: '美美的夏夏小店', vPeriod: '2018.12.14-2018.12.31', voucherType: '代金券', voucherCount: '3' },
        { isAvailable: false, receive: true, bgColor: '#fcf4f2', amount: 10, condition: '满199可用', shopIcon: 'http://www.yougexing.net/uploads/180625/1-1P625150924-50.jpg', shopName: '美美的夏夏小店', vPeriod: '2018.12.14-2018.12.31', voucherType: '代金券', voucherCount: '3' },
      ]
    }
  },
  components: {
    VoucherListItem
  },
  methods: {
    onSelectVoucher() {
      this.isShowPopup
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
.card {
  border-radius: 10px;
  background-color: white;
  width: 305px;
  padding: 26px 20px;
  margin-top: 10px;
  font-size: 24px;
}
.open-input {
  width: 168px;
}
.voucher {
  font-size: 13px;
  color: $--main-color;
}
.voucher-tag {
  border: 1px solid $--main-color;
  padding: 2px;
  border-radius: 4px;
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
.card>div:last-child {
  margin-top: 34px;
}
.amount {
  font-size: 16px;
  font-weight: bold;
  margin-right: 3px;
}
.pay-btn {
  padding: 16px 28px;
  color: white;
  background-color: $--main-color;
  border-radius: 30px;
  font-size: 17px;
  box-shadow:0px 2px 29px 0px rgba(255,154,163,1);
  margin-top: 100px;
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
