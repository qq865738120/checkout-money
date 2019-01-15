<template>
  <div class="root">
    <img class="icon" v-lazy="shopIcon"/>
    <p class="title">搜空生活小店</p>
    <div class="com-flex-center card">
      <span>￥</span><input class="open-input" placeholder="请输入付款金额" />
    </div>
  </div>
</template>

<script>
import methods from '@/common/home.js'


export default {
  name: 'Home',
  created() {

  },
  mounted() {

  },
  data () {
    return {
      shopIcon: 'http://www.yougexing.net/uploads/180625/1-1P625150924-50.jpg'
    }
  },
  components: {

  },
  methods: {

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
  width: 345px;
  padding: 26px 0;
  margin-top: 10px;
  font-size: 24px;
}
.open-input {
  width: 168px;
}
</style>
