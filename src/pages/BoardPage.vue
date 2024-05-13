<template>
  <q-page class="q-mt-xl full-height">
    <BoardHeader title="게시글 목록" />
    <LoaderComponent v-if="loading" :size="5" fixed />
    <div v-else class="board-component full-height">
      <BoardList :postLists="postList" />
      <Pagination
        :pageCount="pageCount"
        v-model:currentPageNumber="currentPageNumber"
      />
      <BoardFooter />
    </div>
  </q-page>
</template>
<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useBoardStore } from "stores/board.js";
import { useRoute, useRouter } from "vue-router";
import BoardHeader from "components/BoardHeader.vue";
import BoardList from "components/BoardList.vue";
import Pagination from "components/PaginationComponent.vue";
import LoaderComponent from "components/LoaderComponent.vue";
import BoardFooter from "components/BoardFooter.vue";

const POST_PER_PAGE = 9;
const boardStore = useBoardStore();
const route = useRoute();
const router = useRouter();

const postList = computed(() => boardStore.postList);
const pageCount = computed(() => boardStore.pageCount);
const loading = computed(() => boardStore.loading);

const currentPageNumber = ref(1);

let searchBy;
let q;
let isSearchRequested;

// 페이지 바뀔 때마다 해당 페이지 게시글들 fetch
watch(currentPageNumber, fetchPosts);

// query parameter 변경(검색, 검색 후 뒤로가기)시 페이지 새로고침
watch(
  () => route.query.q,
  () => {
    router.go(0);
  },
);

// mount시 현재 페이지에 해당하는 게시글 조회
onMounted(() => {
  let params = { page: currentPageNumber.value, size: POST_PER_PAGE };

  // 사용자가 검색한 경우, param에 검색조건(searchBy) 및 검색어(q) 추가
  if (route.query.searchBy || route.query.q) {
    isSearchRequested = true;
    searchBy = route.query.searchBy;
    q = route.query.q;

    params.searchBy = searchBy;
    params.q = q;
  }

  boardStore.fetchPosts(params);
});

function fetchPosts() {
  let params = { page: currentPageNumber.value, size: POST_PER_PAGE };

  if (isSearchRequested) {
    params.searchBy = searchBy;
    params.q = q;
  }

  boardStore.fetchPosts(params);
}
</script>
