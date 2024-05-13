<template>
  <div class="header text-h4 text-dark row text-weight-bold">
    <div class="title">{{ props.title }}</div>
    <div
      v-if="isMyPost"
      class="edit-comp"
      style="margin-left: auto; margin-bottom: auto"
    >
      <q-icon
        v-if="!editFlag"
        @click="editFlag = true"
        size="sm"
        color="grey-8"
        class="row"
        :name="outlinedChevronLeft"
      ></q-icon>
      <div v-else class="row">
        <q-icon
          v-for="(editComponent, idx) in editComponents"
          :key="idx"
          :name="editComponent.name"
          :color="editComponent.color"
          :size="editComponent.size"
          @click="editComponent.onClick"
        ></q-icon>
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
  outlinedChevronLeft,
  outlinedClose,
  outlinedDelete,
  outlinedEdit,
} from "@quasar/extras/material-icons-outlined";
// 게시글 제목 외의 다른 정보 보여줄 수도. (ex. 유저 이름 등)
const props = defineProps({
  title: String,
  postId: Number,
  postUserId: Number,
});
const router = useRouter();
const boardStore = useBoardStore();

const userId = useMemberStore().userId;

const isMyPost = computed(() => userId == props.postUserId);
const editFlag = ref(false);

const editComponents = [
  {
    size: "sm",
    color: "negative",
    name: outlinedDelete,
    onClick: () => {
      deletePost();
    },
  },
  {
    size: "sm",
    color: "grey-5",
    name: outlinedEdit,
    onClick: () => {
      router.push("./edit");
    },
  },
  {
    size: "sm",
    color: "grey-5",
    name: outlinedClose,
    onClick: () => {
      editFlag.value = false;
    },
  },
];

function deletePost() {
  if (!confirm("삭제하시겠습니까?")) return;
  boardStore.deletePost(props.postId);
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
