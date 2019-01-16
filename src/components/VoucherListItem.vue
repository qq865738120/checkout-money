<template>
  <div class="root" :style="{ backgroundColor: bgColor}">

  </div>
</template>

<script>
export default {
  name: 'VoucherListItem',
  mounted() {

  },
  props: {
    bgColor: String
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
  width: 305px;
  height: 95px;
  box-shadow: 0px 2px 13px 0px rgba(186,186,186,0.41);
  border-radius: 5px;
}
</style>
