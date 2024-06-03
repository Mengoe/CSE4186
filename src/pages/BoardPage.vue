<template>
  <q-page class="q-mt-lg full-height">
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
import { ref, computed, watch } from "vue";
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

const jobGroups = [
  "",
  "BE",
  "FE",
  "AP",
  "GM",
  "DS",
  "BD",
  "DV",
  "EM",
  "SE",
  "AI",
  "ET",
];

// mount시 현재 페이지에 해당하는 게시글 조회
function setPosts() {
  let params = { page: currentPageNumber.value, size: POST_PER_PAGE };
  let fieldIndex = 0;

  if (route.query.searchBy || route.query.q) {
    let tmp = jobGroups.indexOf(route.query.q);

    fieldIndex = tmp > 0 ? tmp : 0;

    isSearchRequested = true;
    searchBy = route.query.searchBy;
    q = route.query.q;

    params.searchBy = searchBy;
    params.q = q;
  }

  localStorage.setItem("selectedJob", fieldIndex);

  boardStore.fetchPosts(params);
}

setPosts();

function fetchPosts() {
  let params = { page: currentPageNumber.value, size: POST_PER_PAGE };

  if (isSearchRequested) {
    params.searchBy = searchBy;
    params.q = q;
  }

  boardStore.fetchPosts(params);
}
</script>
