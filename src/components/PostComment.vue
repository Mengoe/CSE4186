<template>
  <div class="comment column q-mt-xl">
    <q-list bordered separator>
      <q-item
        v-for="(comment, idx) in comments"
        :key="comment.id"
        class="column q-gutter-y-xs"
      >
        <div class="row">
          <div :class="{ mine: comment.userId == userId }">
            {{ comment.username }}
          </div>
          <div class="text-grey q-ml-sm">{{ comment.createdAt }}</div>
          <div class="edit-comp" style="margin-left: auto">
            <q-icon
              v-if="!editFlags[idx]"
              size="sm"
              color="grey-9"
              :name="outlinedChevronLeft"
              @click="editFlags[idx] = true"
            ></q-icon>
            <div v-else class="row">
              <q-icon
                v-if="comment.userId == userId"
                size="sm"
                color="negative"
                :name="outlinedDelete"
                @click="deleteComment(comment.postId, comment.id)"
              ></q-icon>
              <q-icon
                v-if="comment.userId == userId"
                size="sm"
                color="grey-5"
                :name="outlinedEdit"
              ></q-icon>
              <q-icon
                size="sm"
                color="grey-5"
                :name="outlinedClose"
                @click="editFlags[idx] = false"
              ></q-icon>
            </div>
          </div>
        </div>
        <q-item-section>
          {{ comment.content }}
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useBoardStore } from "src/stores/board";
import { useMemberStore } from "src/stores/member";
import {
  outlinedChevronLeft,
  outlinedClose,
  outlinedDelete,
  outlinedEdit,
} from "@quasar/extras/material-icons-outlined";
const props = defineProps({
  comments: Array,
  postId: Number,
});

const boardStore = useBoardStore();
const userId = useMemberStore().userId;

const newComment = ref("");
const editFlags = ref(new Array(props.comments.length).fill(false));

function addComment() {
  boardStore.addComment(newComment.value);
}

function deleteComment(postId, commentId) {
  console.log(postId, commentId);
  if (!confirm("삭제하시겠습니까?")) return;

  boardStore.deleteComment(postId, commentId);
}
</script>
<style lang="scss" scoped>
.q-icon {
  cursor: pointer;
}

.mine {
  color: $blue-4;
}
</style>
