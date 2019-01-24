<template>
  <div class="root">
    <Icon type="warn" is-msg></Icon>
    <p>支付失败啦！</p>
  </div>
</template>

<script>
export default {
  name: '',
  mounted() {
    let that = this;
  },
}
</script>

<style scoped>
.root {
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.root>p {
  margin-block-start: 30px;
  font-size: 14px;
}
</style>
