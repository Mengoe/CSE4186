<template>
  <div class="footer row">
    <q-btn color="primary" size="md" to="/board">목록으로</q-btn>
    <q-btn
      color="primary"
      size="md"
      @click="showCommentModal = true"
      style="margin-left: auto"
      >피드백 남기기</q-btn
    >
    <q-dialog v-model="showCommentModal" backdrop-filter="blur(4px)" persistent>
      <CommentForm />
    </q-dialog>
  </div>
</template>
<script setup>
import { ref } from "vue";
import CommentForm from "components/CommentForm.vue";
const showCommentModal = ref(false);
</script>

<style lang="scss" scoped></style>
