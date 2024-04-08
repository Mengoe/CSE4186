<template>
  <div class="comment column q-mt-xl">
    <q-list bordered separator>
      <q-item
        v-for="comment in comments"
        :key="comment.id"
        class="column q-gutter-y-xs"
      >
        <div class="row">
          <div>{{ comment.username }}</div>
          <div class="text-grey q-ml-sm">{{ comment.createdAt }}</div>
        </div>
        <q-item-section>
          {{ comment.content }}
        </q-item-section>
      </q-item>

      <q-item>
        <q-form
          class="row q-gutter-md full-width justify-between"
          @submit="addComment"
        >
          <q-input
            v-model="newComment"
            outlined
            type="textarea"
            input-style="height : 66px;"
            style="width: 70%"
            :rules="[(val) => (val && val !== '') || '내용을 입력해주세요.']"
          />
          <q-btn
            color="primary"
            type="submit"
            style="max-height: 66px; width: 10%"
          >
            입력
          </q-btn>
        </q-form>
      </q-item>
    </q-list>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useBoardStore } from "src/stores/board";

const props = defineProps({
  comments: Array,
  postId: Number,
  userId: Number,
});

const boardStore = useBoardStore();
const newComment = ref("");

function addComment() {
  boardStore.addComment(newComment.value, props.postId, props.userId);
}
</script>
