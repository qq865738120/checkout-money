<template>
  <div class="root">
    <Icon :type="iconType" is-msg></Icon>
    <p>{{ msg1 }}{{ count }}{{ msg2 }}</p>
  </div>
</template>

<script>
export default {
  name: 'TipsPage',
  data() {
    return {
      iconType: '', //图标类型
      msg1: '', //提示消息1
      count: 0, //多少秒后跳转
      msg2: '', //提示消息2
      href: '', //跳转的路径
    }
  },
  created() {
    let that = this;
    this.iconType = this.$route.params.iconType
    this.msg1 = this.$route.params.msg1
    this.count = this.$route.params.count
    this.msg2 = this.$route.params.msg2
    this.href = this.$route.params.href
    if (this.href != undefined) {
      let id = setInterval(() => {
        that.count--
      }, 1000);
      setTimeout(() => {
        clearInterval(id);
        window.location.href = that.href
      }, that.count * 1000)
    }
  }
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
