<template>
  <div class="root com-flex-center">
    <div class="left" :style="{ backgroundColor: data.bgColor, color: data.isAvailable ? '' : '#999'}">
      <div class="content-left com-flex-col-center" :style="{ color: data.isAvailable ? '' : '#999'}">
        <span class="first" :class="data.voucherType == '代金券' ? 'first-before' : 'first-after'">{{ data.amount }}</span>
        <span>{{ data.condition }}</span>
      </div>
      <div class="content-right">
        <div><img v-lazy="data.shopIcon" :style="{ filter: data.isAvailable ? '' : 'grayscale(100%)' }" /><span>{{ data.shopName }}</span></div>
        <div>有效期 {{ data.vPeriod }}</div>
        <div>
          <div :style="{ background: data.isAvailable ? '' : '#999'}">{{ data.voucherType }}</div>
          <!-- <span :style="{ color: data.isAvailable ? '' : '#999'}">{{ data.voucherCount }}张可用</span> -->
        </div>
      </div>
    </div>
    <div class="right com-flex-center iconfont icon-voucher" :style="{color: data.isAvailable ? '#F62135' : '#999'}">
      <span>
        {{ data.isAvailable ? (data.receive ? '立即领取' : '立即使用') : '不可用' }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VoucherListItem',
  mounted() {

  },
  props: {
    data: Object
  },
  data() {
    return {

    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/style/common.scss';
.root {
  position: relative;
  width: 100%;
  height: 95px;
}
.left {
  width: 262px;
  height: 95px;
  box-shadow: 0px 2px 13px 0px rgba(186,186,186,0.41);
  border-radius: 5px;
  position: absolute;
  left: 30px;
  z-index: 1px;
  display: flex;
  align-items: center;
}
.right {
  position: absolute;
  right: 30px;
}
.right>span {
  position: absolute;
  right: 20px;
  color: white;
  font-size: 13px;
  width: 13px;
  line-height: 16px;
}
.content-left {
  width: 100px;
  height: 66px;
  border-right: 1px dotted $--color-ccc;
  color: $--main-color;
  margin-right: 14px;
}
.first {
  font-size: 28px;
  margin-bottom: 4px;
}
.first-before::before {
  content: "￥";
  font-size: 14px;
}
.first-after::after {
  content: "折";
  font-size: 14px;
}
.content-right {
  height: 56px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.content-right>div:first-child {
  display: flex;
  align-items: flex-end;
}
.content-right>div:first-child img {
  width: 15px;
  height: 15px;
}
.content-right>div:first-child span {
  font-size: 13px;
  font-weight: bold;
  margin-left: 4px;
}
.content-right>div:nth-of-type(2) {
  font-size: 10px;
  color: $--color-999;
}
.content-right>div:nth-of-type(3) {
  display: flex;
  align-items: center;
}
.content-right>div:nth-of-type(3)>div {
  font-size: 8px;
  color: white;
  background: linear-gradient(197deg,rgba(253,182,7,1),rgba(245,87,46,1));
  border-radius: 2px;
  padding: 3px 6px;
  margin-right: 10px;
}
.content-right>div:nth-of-type(3)>span {
  font-size: 12px;
  color: $--color-666;
}
</style>
