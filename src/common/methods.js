/*
获取优惠券详细信息
参数：context Object 页面this引用
     data Object 优惠券数据对象
     amount String 支付金额
     receive Boolean 是否显示“立即领取”
返回：可直接用于VoucherListItem组件的数据对象
*/
const getVoucherDetail = function(context, data, amount, receive) {
  let result = []
  for (let item of data) {
    result.push(_formatVoucherDetail(context, item, amount, receive))
  }
  return result
}

/*
格式化优惠券详情
参数：context Object 页面this引用
     data Object 优惠券数据对象
     amount String 支付金额
     receive Boolean 是否显示“立即领取”
返回：可直接用于VoucherListItem组件的数据对象
*/
const _formatVoucherDetail = function(context, data, amount, receive) {
  let result = {};
  result.shopName = context.$store.state.shopName;
  result.shopIcon = context.$store.state.shopIcon;
  result.bgColor = '#fcf4f2';
  result.vPeriod = context.$utils.formatDate(context.$utils.string2Date(data.startTimeStr), 'yyyy.MM.dd') + '-' + context.$utils.formatDate(context.$utils.string2Date(data.endTimeStr), 'yyyy.MM.dd');
  result.voucherType = data.discountType == 1 ? '代金券' : '折扣券';
  result.condition = '满' + data.useMoney + '可用';
  result.amount = data.discountType == 1 ? data.moneyStr : data.rebate;
  result.isAvailable = receive ? true : parseFloat(amount) >= parseFloat(data.useMoneyStr) ? true : false;
  result.receive = receive;
  result.id = data.discountDetailId || data.discountId;
  return result
}

/*
页面初始化操作
参数：that 页面this引用
*/
const appInit = async function(that) {
  const openId = that.$utils.getParam('openId')
  const aliPayUserId = that.$utils.getParam('aliPayUserId')
  that.$store.commit('setOpenId', openId)
  that.$store.commit('setAliPayUserId', aliPayUserId)

  if (openId != null || aliPayUserId != null) {
    let para = openId == null ? aliPayUserId : openId
    await that.$axios.get(that.$store.state.host + that.$store.state.path + '/sk2/mobile/userinfo/getMainUserIdByOpenId', { params: { openId: para }}).then(res => {
      console.log('获取用户id', res.data);
      if (res.data.status == '100') {
        that.$store.commit('setMainUserId', res.data.data.mainUserId)
      }
    })
  }
  let cashierCode = ''
  if (openId != null) { //微信支付
    cashierCode = 'SKM-WECHAT'
  } else if (aliPayUserId != null) { //支付宝支付
    cashierCode = 'SKM-AILPAY'
  } else {
    // that.$router.push({ //不支持的浏览器，跳转到提示页面
    //   name: 'TipsPage',
    //   params: {
    //     iconType: 'warn',
    //     msg1: '不支持的浏览器类型。'
    //   }
    // })
  }
  await that.$axios.get(that.$store.state.host + that.$store.state.path + '/sk2/mobile/cashierinfo/getCashierinfo', { params: { cashierCode: cashierCode }}).then(res => {
    console.log('获取收银台列表', res.data);
    if (res.data.status == 100) {
      that.$store.commit('setCashierId', res.data.data.paymentChannels[0].channelId)
    } else {
      that.$router.push({ //不支持的浏览器，跳转到提示页面
        name: 'TipsPage',
        params: {
          iconType: 'warn',
          msg1: '网络异常，请稍后重试。'
        }
      })
    }
  })
}

export default {
  getVoucherDetail,
  appInit
}
