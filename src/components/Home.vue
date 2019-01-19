<template>
  <div class="root">
    <img class="icon" v-lazy="shopIcon"/>
    <p class="title">{{ shopName }}</p>
    <div class="com-flex-center card">
      <span>￥</span>
      <input v-model="inputAmount" type="number" class="open-input" :style="{width: inputWidth}" v-if="$store.state.qrcodeType == '1'" :placeholder="placeholder" @blur="onInputBlur" @keyup="onInputChange" />
      <span v-if="$store.state.qrcodeType == '2'">{{ $store.state.amount }}</span>
    </div>
    <div class="card" style="margin-top: 1px">
      <div class="voucher com-flex-between">
        <span class="voucher-right iconfont icon-youhuiquan">优惠券</span>
        <div class="com-flex-between" v-if="state == 'selectVoucher'">
          <div class="voucher-tag">满减券</div>
          <span class="iconfont icon-jiantou" style="font-size: 13px">-￥{{ amount }}</span>
        </div>
        <span v-if="state == 'haveVoucher'" class="iconfont icon-jiantou color-999" style="font-size: 13px" @click="onSelectVoucherClick">使用优惠券</span>
        <span v-if="state == 'noVoucher'" class="color-999" style="font-size: 13px">暂无优惠券</span>
      </div>
      <div class="voucher com-flex-between">
        <span class="voucher-right iconfont icon-purse">实付款</span>
        <span class="amount">￥{{ amount }}</span>
      </div>
    </div>
    <div class="pay-btn">开始付款</div>
    <!-- <p class="offer">使用优惠码</p> -->
    <Popup v-model="isShowPopup" height="50%" style="border-radius: 15px 15px 0 0;">
      <div class="popup-select-voucher com-flex-col-center">
        <p>优惠券</p>
        <VoucherListItem class="voucher-item" v-for="(item, index) of voucherList" :data="item" :key="index"></VoucherListItem>
      </div>
    </Popup>
  </div>
</template>

<script>
import methods from '@/common/methods.js'
import VoucherListItem from '@/components/VoucherListItem'
let fontSize = '37.5';
let voucherList = []; //优惠券列表接口返回数据，将在页面初始化时调用接口获取

export default {
  name: 'Home',
  async mounted() {
    fontSize = parseInt(this.$('html').css('font-size').replace('px', ''));
    await this.$utils.waitTask(this, 'initFag'); //等待初始化任务完成后继续执行下面代码
    this.init()
  },
  data () {
    return {
      shopIcon: 'http://www.yougexing.net/uploads/180625/1-1P625150924-50.jpg',
      shopName: '店铺名称',
      inputWidth: 168 / fontSize + 'rem',
      placeholder: '请输入付款金额',
      inputAmount: '',
      state: 'noVoucher', // selectVoucher: 选中了优惠券  haveVoucher：有可选优惠券  noVoucher: 没有可使用的优惠券
      voucherAmount: 10.00,
      amount: 188.00,
      isShowPopup: false,
      voucherList: [ // isAvailable: 是否可使用, receive: 是否显示立即领取, bgColor: 背景色, amount: 优惠券金额, condition: 优惠券使用条件, shopIcon: 店铺图标, shopName: 店铺名称, vPeriod: 使用期限
        { isAvailable: false, receive: false, bgColor: '#fcf4f2', amount: 10, condition: '满199可用', shopIcon: 'http://www.yougexing.net/uploads/180625/1-1P625150924-50.jpg', shopName: '美美的夏夏小店', vPeriod: '2018.12.14-2018.12.31', voucherType: '代金券', voucherCount: '3' },
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
    init() {
      let that = this
      this.$axios.get(this.$store.state.host + this.$store.state.path + '/sk2/mobile/company/getCmpyInfo', { params: { mchId: that.$store.state.mchId }}).then(res => {
        console.log('获取商户信息', res.data);
        if (res.data.status == '100') {
          that.shopIcon = res.data.data.logoUrl;
          that.$store.commit('setShopIcon', res.data.data.logoUrl)
          that.shopName = res.data.data.cmpyName;
          that.$store.commit('setShopName', res.data.data.cmpyName)
        }
      })
      let parm = {
        mchId: that.$store.state.mchId,
        mainUserId: that.$store.state.mainUserId
      }
      this.$axios.get(this.$store.state.host + this.$store.state.path + '/sk2/cmpy/discount/userDiscounts', { params: parm}).then(res => {
        console.log('获取优惠券列表', res.data);
        if (res.data.status == 100) {
          let data = res.data.data
          if (data.length == 0) { //没有优惠券
            this.state = 'noVoucher'
          } else { //有优惠券
            this.state = 'haveVoucher'
            voucherList = data;
          }
        }
      })
    },

    onInputChange() { //金额输入框数值改变触发
      this.placeholder = ''
      this.inputWidth = (14 + this.inputAmount.length * 14) / fontSize + 'rem'
    },

    onInputBlur() { //金额输入框失去焦点
      this.$store.commit('setAmount', this.inputAmount)
      if (this.inputAmount == '') {
        this.placeholder = '请输入付款金额'
        this.inputWidth = 168 / fontSize + 'rem'
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
      let list = [];
      this.$vux.loading.show({
       text: '加载中'
      })
      for (let item of voucherList) { //遍历优惠券，并且获取每个优惠券的详细信息
        let data = await methods.getVoucherDetail(this, item.discountId, this.inputAmount, false)
        list.push(data)
      }
      this.$vux.loading.hide()
      console.log('list', list);
      this.voucherList = list
      this.isShowPopup = true
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
// .open-input {
//   width: 168px;
// }
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
  padding: 16px 28px;
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
