<template>
  <q-spinner
    color="primary"
    :style="{
      width: `${size}rem`,
      height: `${size}rem`,
      zIndex: zIndex,
    }"
    :class="{ absolute: absolute, fixed: fixed }"
  />
</template>

<script>
export default {
  props: {
    size: {
      type: Number,
      default: 2,
    },
    absolute: {
      type: Boolean,
      default: false,
    },
    fixed: {
      type: Boolean,
      default: false,
    },
    zIndex: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style lang="scss" scoped>
.q-spinner {
  margin: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  // absolute : 부모 요소 기준으로의 배치
  &.absolute {
    position: absolute;
  }

  // fixed : 뷰포트의 특정 위치에 배치
  &.fixed {
    position: fixed;
  }
}
</style>
