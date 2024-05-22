<template>
  <div class="comment column q-mt-xl q-mb-xl full-width shadow-3">
    <q-item
      v-for="(comment, idx) in post.comments"
      :key="comment.id"
      class=""
      style="position: relative; max-width: 100%; word-break: break-all"
    >
      <div class="full-width row justify-start items-center">
        <div :class="{ mine: comment.userId == userId }">
          {{ comment.username }}
        </div>

        <q-item-section class="column q-pl-lg q-gutter-y-sm">
          <div class="comment-meta row no-wrap">
            <div>
              <q-rating
                :model-value="
                  getAverageRating(
                    comment.content.verbal,
                    comment.content.nonverbal,
                  )
                "
                readonly
                size="2.0em"
                color="primary"
                icon="star_border"
                icon-selected="star"
                icon-half="star_half"
                no-dimming
              ></q-rating>
            </div>
            <div class="text-grey q-ml-sm q-pt-xs">
              {{ comment.createdAt.split(" ")[0] }}
            </div>
            <div class="edit-comp q-pt-xs">
              <q-icon
                v-if="!editFlags[idx]"
                size="sm"
                color="grey-9"
                class="cursor-pointer"
                :name="outlinedChevronLeft"
                @click="editFlags[idx] = true"
              ></q-icon>
              <div v-else class="row">
                <div
                  v-for="editComponent in editComponents"
                  class="cursor-pointer"
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
                  <q-dialog
                    v-model="showEditModal[idx]"
                    backdrop-filter="blur(4px)"
                    persistent
                  >
                    <CommentEditForm
                      :verbal="comment.content.verbal"
                      :nonverbal="comment.content.nonverbal"
                      :review="comment.content.review"
                      :postId="comment.postId"
                      :commentId="comment.id"
                    />
                  </q-dialog>
                </div>
              </div>
            </div>
          </div>

          <q-item-section>
            <div>
              {{ comment.content.review }}
            </div>
            <div class="q-mt-sm">
              <q-btn
                @click="showDetailFlag[idx] = true"
                outline
                color="primary"
                size="sm"
              >
                자세히
              </q-btn>
              <q-dialog
                v-model="showDetailFlag[idx]"
                backdrop-filter="blur(4px)"
              >
                <CommentDetail
                  :verbal="comment.content.verbal"
                  :nonverbal="comment.content.nonverbal"
                  :reviewText="comment.content.review"
                />
              </q-dialog>
            </div>
          </q-item-section>

          <q-separator />
        </q-item-section>
      </div>
    </q-item>
  </div>
</template>
<script setup>
import { computed, ref } from "vue";
import { useBoardStore } from "src/stores/board";
import { useMemberStore } from "src/stores/member";
import {
  outlinedChevronLeft,
  outlinedClose,
  outlinedDelete,
  outlinedEdit,
  outlinedWarning,
} from "@quasar/extras/material-icons-outlined";
import CommentDetail from "./CommentDetail.vue";
import CommentEditForm from "./CommentEditForm.vue";

const boardStore = useBoardStore();
const userId = useMemberStore().userId;
const post = computed(() => boardStore.post);

const editFlags = ref(new Array(getCommentLength()).fill(false));
const showEditModal = ref(new Array(getCommentLength()).fill(false));
const showDetailFlag = ref(new Array(getCommentLength()).fill(false));

function getCommentLength() {
  if (post.value.comments) return post.value.comments.length;
  else return 0;
}

function deleteComment(postId, commentId) {
  console.log(postId, commentId);
  if (!confirm("삭제하시겠습니까?")) return;

  boardStore.deleteComment(postId, commentId);
}

function submitReport(commentId) {
  boardStore.submitReport({
    reportType: "comment",
    userId,
    targetId: commentId,
  });
}

function getAverageRating(verb, nverb) {
  let sum = 0;
  for (let i = 0; i < verb.length; i++) sum += verb[i];
  for (let i = 0; i < nverb.length; i++) sum += nverb[i];

  return sum / (verb.length + nverb.length);
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
      showEditModal.value[idx] = true;
    },
  },
  {
    size: "sm",
    color: "negative",
    name: outlinedWarning,
    isShow: (id1, id2) => {
      return id1 != id2;
    },
    onClick: (postId, commentId, idx) => {
      if (!confirm("신고하시겠습니까?")) return;

      submitReport(commentId);
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
.comment {
  border-radius: 15px;
}
.mine {
  color: $primary;
}

.edit-comp {
  position: absolute;
  top: 5%;
  right: 1%;
}
</style>
