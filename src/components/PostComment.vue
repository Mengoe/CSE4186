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
              <div
                v-for="editComponent in editComponents"
                :key="editComponent.name"
              >
                <q-icon
                  v-if="editComponent.isShow(comment.userId, userId)"
                  :name="editComponent.name"
                  :color="editComponent.color"
                  :size="editComponent.size"
                  @click="
                    editComponent.onClick(comment.postId, comment.id, idx)
                  "
                ></q-icon>
              </div>
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

function editComment(postId, commentId) {
  console.log("edit Comment!");
}

const editComponents = [
  {
    size: "sm",
    color: "negative",
    name: outlinedDelete,
    isShow: (id1, id2) => {
      return id1 == id2;
    },
    onClick: (postId, commentId, idx) => {
      deleteComment(postId, commentId);
    },
  },
  {
    size: "sm",
    color: "grey-5",
    name: outlinedEdit,
    isShow: (id1, id2) => {
      return id1 == id2;
    },
    onClick: (postId, commentId, idx) => {
      editComment(postId, commentId);
    },
  },
  {
    size: "sm",
    color: "grey-5",
    name: outlinedClose,
    isShow: (id1, id2) => {
      return true;
    },
    onClick: (postId, commentId, idx) => {
      editFlags.value[idx] = false;
    },
  },
];
</script>
<style lang="scss" scoped>
.q-icon {
  cursor: pointer;
}

.mine {
  color: $blue-4;
}
</style>
