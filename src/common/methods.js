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
  result.amount = data.discountType == 1 ? data.money : data.rebate;
  result.isAvailable = receive ? true : parseInt(amount) >= data.useMoney ? true : false;
  result.receive = receive;
  result.id = data.discountDetailId || data.discountId;
  return result
}

export default {
  getVoucherDetail
}
