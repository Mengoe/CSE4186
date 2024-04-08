<template>
  <q-page class="q-mt-xl full-height">
    <LoaderComponent v-if="loading" :size="5" fixed />
    <BoardTitle title="게시글 목록" />
    <BoardList :postLists="currentPagePosts" />
    <div
      class="board-footer row flex-center q-gutter-x-md q-mb-xl fixed-bottom"
    >
      <Pagination
        :pageCount="pageCount"
        v-model:currentPageNumber="currentPageNumber"
      />
      <q-btn color="primary" text-color="white" to="/board/post">글쓰기 </q-btn>
    </div>
  </q-page>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import { useBoardStore } from "stores/board.js";

import BoardTitle from "components/BoardTitle.vue";
import BoardList from "components/BoardList.vue";
import Pagination from "components/PaginationComponent.vue";
import LoaderComponent from "components/LoaderComponent.vue";

const POST_PER_PAGE = 9;
const boardStore = useBoardStore();

const postList = computed(() => boardStore.postList);
const postLength = computed(() => postList.value.length);
const loading = computed(() => boardStore.loading);
const pageCount = computed(() => Math.ceil(postLength.value / POST_PER_PAGE)); // 전체 페이지의 개수

const currentPageNumber = ref(1);
const currentPagePosts = computed(() => {
  const startIndex = (currentPageNumber.value - 1) * POST_PER_PAGE;
  const lastIndex = Math.min(startIndex + POST_PER_PAGE, postLength.value);

  return postList.value.slice(startIndex, lastIndex);
});

// mount시 모든 게시글 조회
onMounted(() => {
  boardStore.fetchAllPosts();
});
</script>
<style lang="scss" scoped></style>
