<template>
  <div class="header text-h5 row text-weight-bold relative-position q-pl-md">
    <div class="title-meta q-pr-md q-pt-md column">
      <div class="text-caption text-primary">{{ post.jobField }}</div>
      <div>{{ post.title }}</div>
      <div class="text-caption text-grey">
        <span>{{ post.userName }} &bull; {{ getDate(post.createdAt) }}</span>
      </div>
    </div>
    <div
      class="edit-comp absolute-top-right"
      style="margin-left: auto; margin-bottom: auto"
    >
      <q-icon
        v-if="!editFlag"
        @click="editFlag = true"
        size="sm"
        color="grey-8"
        class="row"
        :name="outlinedMoreVert"
      ></q-icon>
      <div v-else class="row">
        <div v-for="(editComponent, idx) in editComponents" :key="idx">
          <q-icon
            v-if="editComponent.isShow()"
            :name="editComponent.name"
            :color="editComponent.color"
            :size="editComponent.size"
            @click="editComponent.onClick"
          ></q-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMemberStore } from "src/stores/member";
import { useBoardStore } from "src/stores/board";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import {
  outlinedWarning,
  outlinedClose,
  outlinedDelete,
  outlinedEdit,
  outlinedMoreVert,
} from "@quasar/extras/material-icons-outlined";
// 게시글 제목 외의 다른 정보 보여줄 수도. (ex. 유저 이름 등)

const router = useRouter();
const boardStore = useBoardStore();

const userId = useMemberStore().userId;
const post = computed(() => boardStore.post);

const isMyPost = computed(() => userId == post.value.userId);
const editFlag = ref(false);

const editComponents = [
  {
    size: "sm",
    color: "negative",
    name: outlinedDelete,
    isShow: () => {
      return isMyPost.value;
    },
    onClick: () => {
      deletePost();
    },
  },
  {
    size: "sm",
    color: "grey-5",
    name: outlinedEdit,
    isShow: () => {
      return isMyPost.value;
    },
    onClick: () => {
      router.push("/board/edit");
    },
  },
  {
    size: "sm",
    color: "negative",
    name: outlinedWarning,
    isShow: () => {
      console.log(isMyPost.value);
      return !isMyPost.value;
    },
    onClick: () => {
      if (!confirm("신고하시겠습니까?")) return;

      submitReport();
    },
  },
  {
    size: "sm",
    color: "grey-5",
    isShow: () => {
      return true;
    },
    name: outlinedClose,
    onClick: () => {
      editFlag.value = false;
    },
  },
];

function deletePost() {
  if (!confirm("삭제하시겠습니까?")) return;
  boardStore.deletePost(post.value.id);
}

function submitReport() {
  if (!confirm("신고하시겠습니까?")) return;

  boardStore.submitReport({
    reportType: "post",
    userId,
    targetId: post.value.id,
  });
}

function getDate(createdAt) {
  if (typeof createdAt === "string" || createdAt instanceof String)
    return createdAt.split(" ")[0];
  else return null;
}
</script>

<style lang="scss" scoped>
.header {
  line-height: 1.3;
}

.q-icon {
  cursor: pointer;
}
</style>
