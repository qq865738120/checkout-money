<template>
  <div id="app" :style="{ background: $route.meta.bgColor }">
    <transition
      enter-active-class="animated fadeInLeftBig faster"
      leave-active-class="animated fadeOutLeftBig faster">
      <router-view v-wechat-title="$route.meta.title" v-show="$store.state.initFag"/>
    </transition>
    <transition
      enter-active-class="animated fadeInLeftBig faster"
      leave-active-class="animated fadeOutLeftBig faster">
      <div class="com-flex-center loading" v-show="!$store.state.initFag">
        <GridLoader color="#ED7E00" size="10"></GridLoader>
        <p>loading...</p>
      </div>
    </transition>
  </div>
</template>

<script>
import { GridLoader } from '@saeris/vue-spinners'

export default {
  name: 'App',
  /* 该方法中完成项目的初始化工作 */
  mounted() {
    console.log('this.$route', this.$route);
  },
  components: {
    GridLoader
  },
  methods: {

  }
}
</script>

<style>
#app {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}
.loading {
  width: 100%;
  height: calc(100% - 60px);
  position: absolute;
  z-index: 1000;
  flex-direction: column;
}
.loading>p {
  color: #ED7E00;
}
</style>
