<template>
  <div class="title text-h2 text-dark">
    {{ props.title }}
  </div>
</template>
<script setup>
// 게시글 제목 외의 다른 정보 보여줄 수도. (ex. 유저 이름 등)
const props = defineProps({
  title: String,
});
</script>

<style lang="scss" scoped>
.title {
  line-height: 1.3;
}
</style>
